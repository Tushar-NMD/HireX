const nodemailer = require('nodemailer').default || require('nodemailer');

const sendEmail = async (options) => {
  try {
    console.log('📧 Attempting to send email...');
    console.log('To:', options.email);
    console.log('Subject:', options.subject);
    
    let transporter;
    
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your-email@gmail.com') {
      // Use Ethereal for testing if no real email configured
      console.log('⚠️  No email configured, creating test account...');
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      console.log('📧 Using Ethereal test email account');
    } else {
      // Use configured email
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    }

    // Email options
    const mailOptions = {
      from: `"HireX HR Team" <${process.env.EMAIL_FROM || 'noreply@jobportal.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.message || options.html,
      text: options.text || 'Interview Notification',
      replyTo: options.replyTo || process.env.EMAIL_FROM,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'HireX Job Portal',
        'List-Unsubscribe': `<mailto:${process.env.EMAIL_FROM}?subject=unsubscribe>`
      }
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Generate preview URL for Ethereal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Preview URL:', previewUrl);
      console.log('👆 Open this URL to see the email!');
    }
    
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;