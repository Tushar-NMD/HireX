require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

// Test email sending
const testEmail = async () => {
  try {
    console.log('🧪 Testing email configuration...\n');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
    console.log('\n');

    await sendEmail({
      email: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email - Job Portal',
      message: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #667eea;">Email Test Successful! ✅</h2>
          <p>If you're reading this, your email configuration is working correctly.</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    console.log('\n✅ Test email sent successfully!');
    console.log('Check your inbox:', process.env.EMAIL_USER);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
};

testEmail();
