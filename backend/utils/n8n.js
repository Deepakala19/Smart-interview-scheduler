const triggerN8N = async (interview, type = 'create') => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('N8N_WEBHOOK_URL not set, skipping automation.');
    return;
  }

  // Determine candidate email for the demo
  let candidateEmail = "test@gmail.com"; 
  if (interview.candidateId && typeof interview.candidateId === 'object' && interview.candidateId.email) {
    candidateEmail = interview.candidateId.email;
  }

  console.log("Sending to n8n:", webhookUrl);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type,
        interview,
        candidateEmail
      })
    });

    if (!response.ok) {
      console.error(`N8N webhook failed with status: ${response.status}`);
    } else {
      console.log(`N8N automation triggered for interview ${interview._id || 'manual'}`);
    }
  } catch (error) {
    console.error('Error triggering N8N automation:', error.message);
  }
};

module.exports = { triggerN8N };
