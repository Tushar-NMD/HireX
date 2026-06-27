import axios from 'axios';
import conf from '../config/index.js';

class AuthService {
    constructor() {
        this.api = axios.create({
            baseURL: conf.apiBaseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 seconds timeout
        });

        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getToken();
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

    // Admin Registration
    async registerAdmin(userData) {
        return await this.api.post('/api/admin/register', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
        });
    }

    // Admin Login
    async loginAdmin(userData) {
        return await this.api.post('/api/admin/login', {
            email: userData.email,
            password: userData.password,
        });
    }

    // Employee/User Registration
    async registerEmployee(userData) {
        return await this.api.post('/api/users/register', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
        });
    }

    // Employee/User Login
    async loginEmployee(userData) {
        return await this.api.post('/api/users/login', {
            email: userData.email,
            password: userData.password,
        });
    }

    // Get Admin Profile
    async getAdminProfile() {
        return await this.api.get('/api/admin/profile');
    }

    // Get Employee/User Profile
    async getEmployeeProfile() {
        return await this.api.get('/api/users/profile');
    }

    // Update Admin Profile
    async updateAdminProfile(profileData) {
        return await this.api.put('/api/admin/profile', profileData);
    }

    // Update Employee/User Profile
    async updateEmployeeProfile(profileData) {
        return await this.api.put('/api/users/profile', profileData);
    }

    // Upload Admin Profile Picture
    async uploadAdminProfilePic(file) {
        const formData = new FormData();
        formData.append('profilePic', file);

        return await this.api.post('/api/admin/upload-profile-pic', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    // Upload Employee/User Profile Picture
    async uploadEmployeeProfilePic(file) {
        const formData = new FormData();
        formData.append('profilePic', file);

        return await this.api.post('/api/users/upload-profile-pic', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    // Store token in localStorage
    setToken(token) {
        localStorage.setItem('jobportal_token', token);
    }

    // Get token from localStorage
    getToken() {
        return localStorage.getItem('jobportal_token');
    }

    // Remove token from localStorage
    removeToken() {
        localStorage.removeItem('jobportal_token');
    }

    // Store user data in localStorage
    setUserData(userData) {
        localStorage.setItem('jobportal_user', JSON.stringify(userData));
    }

    // Get user data from localStorage
    getUserData() {
        const userData = localStorage.getItem('jobportal_user');
        return userData ? JSON.parse(userData) : null;
    }

    // Remove user data from localStorage
    removeUserData() {
        localStorage.removeItem('jobportal_user');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }

    // Logout user
    logout() {
        this.removeToken();
        this.removeUserData();
    }
}

// Create and export a single instance
const authService = new AuthService();
export default authService;