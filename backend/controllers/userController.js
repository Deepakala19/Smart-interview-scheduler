const User = require('../models/User');

// @desc    Get all users based on role (for HR/Admin)
// @route   GET /api/users
// @access  Private (HR)
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get specific user profile
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private (HR/Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
      user.status = status;
      await user.save();

      if (status === 'Accepted') {
         try {
           const sendEmail = require('../utils/email');
           await sendEmail({
             email: user.email,
             subject: 'Congratulations! Your Application was Accepted',
             message: `Hi ${user.name},\n\We are excited to inform you that your application has been accepted! Welcome to the team.`
           });
         } catch (e) { console.error("Email failed", e) }
      }

      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update user round (HR Round, Application, Technical etc.)
// @route   PUT /api/users/:id/round
// @access  Private (HR/Admin)
const updateUserRound = async (req, res) => {
  try {
    const { roundType, roundStatus, profileData } = req.body;
    const update = {};
    if (roundType === 'application') {
      update.applicationRound = roundStatus;
      update.hasCompletedProfile = true;
      if (profileData) {
        if (profileData.firstName && profileData.lastName) {
          update.name = `${profileData.firstName} ${profileData.lastName}`;
        }
        update.phone = profileData.phone;
        update.location = profileData.location;
        update.jobRole = profileData.role;
        update.yearsExperience = profileData.experience;
        update.education = profileData.education;
        update.portfolioUrl = profileData.portfolio;
        update.githubUrl = profileData.github;
        update.linkedinUrl = profileData.linkedin;
        update.coverLetter = profileData.coverLetter;
      }
    }
    if (roundType === 'hr') update.hrRound = roundStatus;
    if (roundType === 'technical') update.technicalRound = roundStatus;
    if (roundType === 'final') update.finalRound = roundStatus;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserProfile,
  updateUserStatus,
  updateUserRound,
};
