const Interview = require('../models/Interview');
const User = require('../models/User');
const sendEmail = require('../utils/email');
const { triggerN8N } = require('../utils/n8n');

// @desc    Create a new interview slot
// @route   POST /api/interviews
// @access  Private (HR)
const createInterview = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, candidateId, meetingLink } = req.body;

    // Check if candidate exists
    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.role !== 'candidate') {
      res.status(400);
      throw new Error('Valid candidate ID is required');
    }

    const interview = await Interview.create({
      title,
      description,
      date,
      startTime,
      endTime,
      candidateId,
      hrId: req.user._id,
      meetingLink: meetingLink || 'https://meet.google.com/abc-defg-hij',
    });

    // Notify candidate
    try {
      await sendEmail({
        email: candidate.email,
        subject: 'New Interview Scheduled',
        message: `An interview "${title}" has been scheduled for you on ${date} from ${startTime} to ${endTime}.`,
      });
    } catch (err) {
       console.error("Could not send email", err)
    }

    // Trigger automation
    console.log("Triggering n8n...");
    await interview.populate('candidateId');
    await triggerN8N(interview, 'create');

    res.status(201).json(interview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all interviews (with pagination and filters)
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Role-based filtering
    if (req.user.role === 'candidate') {
      query.candidateId = req.user._id;
    } else if (req.user.role === 'admin') {
      query.adminId = req.user._id;
    }
    // HR can see all or filter by specific user
    else if (req.user.role === 'hr') {
        if (req.query.candidateId) query.candidateId = req.query.candidateId;
        if (req.query.adminId) query.adminId = req.query.adminId;
    }

    // Additional filters like status or search by title
    if (req.query.status) query.status = req.query.status;
    if (req.query.search) query.title = { $regex: req.query.search, $options: 'i' };

    const interviews = await Interview.find(query)
      .populate('candidateId', 'name email')
      .populate('adminId', 'name email')
      .populate('hrId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ date: 1, startTime: 1 });

    const total = await Interview.countDocuments(query);

    res.status(200).json({
      success: true,
      count: interviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: interviews,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Private
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidateId', 'name email')
      .populate('adminId', 'name email')
      .populate('hrId', 'name');

    if (!interview) {
      res.status(404);
      throw new Error('Interview not found');
    }

    // Role check logic (basic implementation)
    if (
      req.user.role === 'candidate' && 
      interview.candidateId._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to access this interview');
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Assign admin to interview
// @route   PUT /api/interviews/:id/assign
// @access  Private (HR)
const assignAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      res.status(400);
      throw new Error('Valid admin ID is required');
    }

    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { 
        adminId,
        adminStatus: 'pending' 
      },
      { new: true, runValidators: true }
    ).populate('candidateId', 'name email');

    if (!interview) {
      res.status(404);
      throw new Error('Interview not found');
    }

    // Notify Admin
    try {
        await sendEmail({
          email: adminUser.email,
          subject: 'Interview Assignment',
          message: `You have been assigned to conduct an interview "${interview.title}" on ${interview.date} from ${interview.startTime} to ${interview.endTime}. Please log in to accept or reject.`,
        });
    } catch(err) {
        console.error("Could not send email to admin", err)
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update interview status (Accept/Reject by Admin or Cancel by HR)
// @route   PUT /api/interviews/:id/status
// @access  Private
const updateInterviewStatus = async (req, res) => {
  try {
     const interview = await Interview.findById(req.params.id).populate('hrId', 'email');
     if (!interview) {
         res.status(404);
         throw new Error('Interview not found');
     }

     if (req.user.role === 'admin') {
         // Admin accepting/rejecting
         const { action } = req.body; // 'accepted' or 'rejected'
         
         if (interview.adminId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized for this interview');
         }

         if (!['accepted', 'rejected'].includes(action)) {
             res.status(400);
             throw new Error('Invalid action');
         }

         interview.adminStatus = action;
         await interview.save();

         // Notify HR
         try {
             await sendEmail({
               email: interview.hrId.email,
               subject: `Interview ${action}`,
               message: `Admin ${req.user.name} has ${action} the interview "${interview.title}".`,
             });
         } catch(e) {
             console.error("Could not notify HR", e)
         }

     } else if (req.user.role === 'hr') {
         // HR Cancelling/Completing
         const { status } = req.body; // 'scheduled', 'completed', 'cancelled'
         if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
             res.status(400);
             throw new Error('Invalid status');
         }
         
         interview.status = status;
         await interview.save();
     } else {
         res.status(403);
         throw new Error('Not authorized to update status');
     }

     // Trigger automation
     triggerN8N(interview, 'status_update');

     res.status(200).json(interview);

  } catch(error) {
     res.status(400).json({ message: error.message });
  }
};

// @desc    Update interview details
// @route   PUT /api/interviews/:id
// @access  Private (HR)
const updateInterview = async (req, res) => {
    try {
        const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!interview) {
            res.status(404);
            throw new Error('Interview not found');
        }

        res.status(200).json(interview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private (HR)
const deleteInterview = async (req, res) => {
    try {
        const interview = await Interview.findByIdAndDelete(req.params.id);

        if(!interview) {
            res.status(404);
            throw new Error('Interview not found');
        }

        res.status(200).json({ id: req.params.id, message: 'Interview deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc    Manual sync interview with N8N/Calendar
// @route   POST /api/interviews/:id/sync
// @access  Private (HR/Admin)
const syncInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)
            .populate('candidateId', 'name email')
            .populate('adminId', 'name email')
            .populate('hrId', 'name email');

        if (!interview) {
            res.status(404);
            throw new Error('Interview not found');
        }

        // Trigger automation manually
        await triggerN8N(interview, 'manual_sync');

        res.status(200).json({ success: true, message: 'Sync triggered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc    Sync all interviews for a user
// @route   POST /api/interviews/bulk-sync
// @access  Private
const syncAllInterviews = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'candidate') query.candidateId = req.user._id;
        else if (req.user.role === 'admin') query.adminId = req.user._id;

        const interviews = await Interview.find(query)
            .populate('candidateId', 'name email')
            .populate('adminId', 'name email')
            .populate('hrId', 'name email');

        for (const interview of interviews) {
            await triggerN8N(interview, 'bulk_sync');
        }

        res.status(200).json({ success: true, message: `Sync triggered for ${interviews.length} interviews` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
  createInterview,
  getInterviews,
  getInterview,
  assignAdmin,
  updateInterviewStatus,
  updateInterview,
  deleteInterview,
  syncInterview,
  syncAllInterviews
};
