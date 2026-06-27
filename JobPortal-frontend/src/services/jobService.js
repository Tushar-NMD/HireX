import axios from 'axios';
import conf from '../config/index.js';
import authService from './authService.js';

class JobService {
    constructor() {
        this.api = axios.create({
            baseURL: conf.apiBaseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60000, // 60 seconds for file uploads
        });

        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = authService.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => {
                return response.data;
            },
            (error) => {
                const message = error.response?.data?.message || error.message || 'Something went wrong';
                return Promise.reject(new Error(message));
            }
        );
    }

    // Post a new job (Admin)
    async postJob(jobData) {
        return await this.api.post('/api/admin/jobs', jobData);
    }

    // Get all jobs posted by admin
    async getMyJobs() {
        return await this.api.get('/api/admin/jobs/my-jobs');
    }

    // Get single job details (Public/Employee)
    async getJobById(jobId) {
        return await this.api.get(`/api/jobs/${jobId}`);
    }

    // Update job
    async updateJob(jobId, jobData) {
        return await this.api.put(`/api/admin/jobs/${jobId}`, jobData);
    }

    // Delete job
    async deleteJob(jobId) {
        return await this.api.delete(`/api/admin/jobs/${jobId}`);
    }

    // Get all jobs (Employee/Public)
    async getAllJobs(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return await this.api.get(`/api/jobs${queryParams ? `?${queryParams}` : ''}`);
    }

    // Apply for a job (Employee/User)
    async applyForJob(jobId, applicationData) {
        const formData = new FormData();
        formData.append('resume', applicationData.resume);
        formData.append('coverLetter', applicationData.coverLetter);
        
        return await this.api.post(`/api/applications/${jobId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    // Get my applications (Employee/User)
    async getMyApplications() {
        return await this.api.get('/api/applications/my-applications');
    }

    // Get all job applications (Admin)
    async getAllApplications() {
        return await this.api.get('/api/admin/applications');
    }

    // Get job applications for specific job (Admin)
    async getJobApplications(jobId) {
        return await this.api.get(`/api/admin/jobs/${jobId}/applications`);
    }

    // Update application status (Admin)
    async updateApplicationStatus(applicationId, status) {
        return await this.api.put(`/api/admin/applications/${applicationId}/status`, { status });
    }
}

// Create and export a single instance
const jobService = new JobService();
export default jobService;
