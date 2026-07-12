const Application = require('../models/Application');
const User = require('../models/user');
const Job = require('../models/Job');
const sendEmail = require('../utils/sendEmail');

// Schedule interview for an application
const scheduleInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { meetLink, scheduledDate, scheduledTime, duration, notes } = req.body;

    // Validate input
    if (!meetLink || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Meet link, date, and time are required'
      });
    }

    // Find application with user and job details
    const application = await Application.findById(applicationId)
      .populate('user', 'name email')
      .populate('job', 'jobTitle companyName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update application with interview details
    application.scheduledInterview = {
      isScheduled: true,
      meetLink,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      duration: duration || 60,
      notes: notes || '',
      emailSent: false,
      scheduledBy: req.admin._id,
      scheduledAt: new Date()
    };

    await application.save();

    // Send email notification to candidate
    try {
      const emailSubject = `Interview Scheduled - ${application.job.jobTitle}`;
      const formattedDate = new Date(scheduledDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const emailBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                  <tr>
                    <td style="padding: 30px; background: white; border-radius: 8px; margin: 10px;">
                      <h2 style="color: #667eea; margin-bottom: 20px;">🎉 Interview Scheduled!</h2>
                      
                      <p style="font-size: 16px; color: #333;">Dear ${application.user.name},</p>
                      
                      <p style="font-size: 15px; color: #555; line-height: 1.6;">
                        Congratulations! Your interview has been scheduled for the position of 
                        <strong style="color: #667eea;">${application.job.jobTitle}</strong> at 
                        <strong style="color: #667eea;">${application.job.companyName}</strong>.
                      </p>

                      <table width="100%" cellpadding="20" style="background: #f8f9ff; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                        <tr>
                          <td>
                            <h3 style="color: #667eea; margin-top: 0;">Interview Details:</h3>
                            <p style="margin: 8px 0; color: #333;"><strong>📅 Date:</strong> ${formattedDate}</p>
                            <p style="margin: 8px 0; color: #333;"><strong>🕐 Time:</strong> ${scheduledTime}</p>
                            <p style="margin: 8px 0; color: #333;"><strong>⏱️ Duration:</strong> ${duration || 60} minutes</p>
                            ${notes ? `<p style="margin: 8px 0; color: #333;"><strong>📝 Notes:</strong> ${notes}</p>` : ''}
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${meetLink}" 
                               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                      color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; 
                                      font-weight: bold; font-size: 16px;">
                              🎥 Join Video Interview
                            </a>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="15" style="background: #fff3cd; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <tr>
                          <td>
                            <p style="margin: 0; color: #856404; font-size: 14px;">
                              <strong>⚠️ Important:</strong> Please join the meeting 5 minutes early and ensure you have a stable internet connection.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="font-size: 14px; color: #555; margin-top: 20px;">
                        Good luck with your interview! If you have any questions, please don't hesitate to reach out.
                      </p>

                      <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                      
                      <p style="font-size: 13px; color: #999; margin: 0;">
                        Best regards,<br>
                        <strong style="color: #667eea;">${application.job.companyName}</strong><br>
                        HR Team
                      </p>
                      
                      <p style="font-size: 11px; color: #aaa; margin-top: 20px; text-align: center;">
                        This is an automated message from ${application.job.companyName}. Please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await sendEmail({
        email: application.user.email,
        subject: emailSubject,
        message: emailBody,
        replyTo: process.env.EMAIL_FROM,
        text: `Interview scheduled for ${application.job.jobTitle} at ${application.job.companyName} on ${formattedDate} at ${scheduledTime}. Meeting link: ${meetLink}`
      });

      application.scheduledInterview.emailSent = true;
      await application.save();

    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Interview scheduled and notification sent successfully',
      data: application
    });

  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to schedule interview'
    });
  }
};

// Get interview details for an application
const getInterviewDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('user', 'name email')
      .populate('job', 'jobTitle companyName')
      .populate('scheduledInterview.scheduledBy', 'companyName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application.scheduledInterview
    });

  } catch (error) {
    console.error('Get interview details error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get interview details'
    });
  }
};

// Cancel scheduled interview
const cancelInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('user', 'name email')
      .populate('job', 'jobTitle companyName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.scheduledInterview.isScheduled = false;
    await application.save();

    // Send cancellation email
    try {
      await sendEmail({
        email: application.user.email,
        subject: `Interview Cancelled - ${application.job.jobTitle}`,
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Interview Cancelled</h2>
            <p>Dear ${application.user.name},</p>
            <p>Your scheduled interview for <strong>${application.job.jobTitle}</strong> at <strong>${application.job.companyName}</strong> has been cancelled.</p>
            <p>We will contact you if we wish to reschedule.</p>
            <p>Best regards,<br>${application.job.companyName}</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
    }

    res.json({
      success: true,
      message: 'Interview cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel interview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel interview'
    });
  }
};

module.exports = {
  scheduleInterview,
  getInterviewDetails,
  cancelInterview
};
