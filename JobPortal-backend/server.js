const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const chatRoutes = require("./routes/chatRoutes");
const trainRoutes = require("./routes/trainRoutes");
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors());

// 🔥 Chatbot route
app.use("/api", chatRoutes);

app.use("/api", trainRoutes);

// Recommendation routes
app.use('/api/jobs', require('./routes/recommendationRoutes'));

// Resume Ranking routes
app.use('/api/admin', require('./routes/resumeRankingRoutes'));

// AI Job Parser routes
app.use('/api/admin', require('./routes/aiJobParserRoutes'));

// Resume Analysis routes
app.use('/api/applications', require('./routes/resumeAnalysisRoutes'));

// Schedule Interview routes
app.use('/api/interviews', require('./routes/scheduleInterviewRoutes'));

// Analytics routes
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Existing routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/jobs', require('./routes/jobRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/publicJobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin/applications', require('./routes/adminApplicationRoutes'));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});