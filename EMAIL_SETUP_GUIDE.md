# 📧 Email Notification Setup Guide

## ✅ Email Feature is Already Implemented!

The email notification system is **fully coded and ready**. You just need to configure your email credentials.

---

## 🎯 What Happens When Interview is Scheduled:

1. **Admin schedules interview** from Top Resumes page
2. **System automatically sends email** to candidate's email address
3. **Candidate receives beautiful HTML email** with:
   - ✅ Interview date, time, duration
   - ✅ Google Meet link (big clickable button)
   - ✅ Job title and company name
   - ✅ Additional notes from admin
   - ✅ Professional formatting with gradients

---

## ⚙️ How to Setup Email (Gmail - Recommended):

### Step 1: Get Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification**:
   - Go to Security → 2-Step Verification
   - Follow the setup process
3. **Create App Password**:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Job Portal"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update `.env` File

Open `JobPortal-backend/.env` and replace these values:

```env
# Replace with your actual Gmail address
EMAIL_USER=your-email@gmail.com

# Replace with the 16-character app password (no spaces)
EMAIL_PASS=abcdefghijklmnop

# Use the same email as FROM address
EMAIL_FROM=your-email@gmail.com
```

### Step 3: Restart Backend Server

```bash
cd JobPortal-backend
npm start
```

---

## 📧 Email Template Preview

When interview is scheduled, candidate receives:

```
┌─────────────────────────────────────────┐
│  🎉 Interview Scheduled!                │
│                                         │
│  Dear John Doe,                         │
│                                         │
│  Your interview has been scheduled for: │
│  Software Engineer at TechCorp          │
│                                         │
│  📅 Date: Monday, January 15, 2024      │
│  🕐 Time: 10:00 AM                      │
│  ⏱️ Duration: 60 minutes                │
│                                         │
│  ┌─────────────────────────┐            │
│  │  🎥 Join Google Meet    │ ← Big Button│
│  └─────────────────────────┘            │
│                                         │
│  ⚠️ Important: Join 5 minutes early     │
│                                         │
│  Good luck!                             │
│  - HR Team                              │
└─────────────────────────────────────────┘
```

---

## 🧪 How to Test Email:

### 1. **Schedule a Test Interview**:
   - Go to Admin Dashboard → Top Resumes
   - Select any job
   - Click "Schedule Interview" on a candidate
   - Fill in date/time
   - Click "Schedule & Send Email"

### 2. **Check Backend Console**:
   - Should see: `Email sent: <message-id>`
   - If error, check your EMAIL credentials

### 3. **Check Candidate's Email**:
   - Check inbox (and spam folder)
   - Email should arrive within seconds
   - Click the "Join Google Meet" button

---

## 🔧 Alternative Email Providers:

### Using Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@outlook.com
```

### Using SendGrid (Production Recommended):
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=your-verified-sender@yourdomain.com
```

### Using Mailtrap (Testing Only):
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASS=your-mailtrap-password
EMAIL_FROM=test@example.com
```

---

## 🚨 Common Issues & Solutions:

### Issue 1: "Invalid login" or "Authentication failed"
**Solution**: 
- Make sure 2-Step Verification is enabled
- Generate a new App Password
- Remove spaces from password in .env file
- Use App Password, NOT your regular Gmail password

### Issue 2: Email not received
**Solution**:
- Check spam/junk folder
- Verify EMAIL_USER and EMAIL_FROM are correct
- Check backend console for errors
- Try sending from a different email

### Issue 3: "Connection refused"
**Solution**:
- Check EMAIL_HOST is correct (smtp.gmail.com)
- Check EMAIL_PORT is 587
- Check your firewall/antivirus settings

### Issue 4: Email sent but looks broken
**Solution**:
- Already fixed! HTML template is complete
- Email client might strip some CSS
- Test in Gmail, Outlook, Apple Mail

---

## 💡 Tips for Production:

1. **Use Professional Email Service**:
   - SendGrid (100 emails/day free)
   - Mailgun (300 emails/day free)
   - AWS SES (very cheap)

2. **Don't Use Personal Gmail** in production:
   - Gmail has daily sending limits (500/day)
   - Can get flagged as spam
   - Not professional

3. **Add SPF/DKIM Records**:
   - Improves email deliverability
   - Reduces spam likelihood
   - Ask your email provider

4. **Monitor Email Logs**:
   - Check backend console
   - Track delivery rates
   - Handle bounce/failures

---

## 📝 Testing Checklist:

- [ ] .env file updated with email credentials
- [ ] Backend server restarted
- [ ] Scheduled test interview
- [ ] Email received in inbox
- [ ] Google Meet link works
- [ ] Email displays correctly on mobile
- [ ] Email displays correctly on desktop
- [ ] Links are clickable
- [ ] Formatting looks professional

---

## 🎓 For Your Project Demo:

1. **Setup Email Before Demo Day**
2. **Test with Your Own Email First**
3. **Show Live Email During Presentation**:
   - Schedule interview in front of evaluators
   - Check email on phone/laptop
   - Click the Meet link
4. **Mention in Report**:
   - "Real-time email notifications using Nodemailer"
   - "Professional HTML email templates"
   - "Automated interview scheduling workflow"

---

## 📊 Current Implementation Status:

✅ **Backend email controller** - Complete  
✅ **HTML email template** - Complete  
✅ **Frontend UI** - Complete  
✅ **Auto-generated Meet links** - Complete  
✅ **Database integration** - Complete  
⏳ **Email credentials** - You need to add  

**You're 95% done! Just add email credentials and test!**

---

## 🆘 Need Help?

If emails still don't work after setup:
1. Check backend console for exact error message
2. Verify all .env variables are correct
3. Try Mailtrap.io for testing (it always works)
4. Make sure nodemailer is installed: `npm install nodemailer`

---

**The email system is ready to go! Just configure and test! 🚀**
