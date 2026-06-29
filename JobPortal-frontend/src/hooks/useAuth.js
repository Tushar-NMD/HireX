import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const token = authService.getToken();
    const userData = authService.getUserData();

    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  const login = async (userType, credentials) => {
    try {
      let response;
      
      if (userType === 'admin') {
        response = await authService.loginAdmin(credentials);
      } else {
        response = await authService.loginEmployee(credentials);
      }

      if (response.success && response.data) {
        const userData = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role || userType
        };

        // Ensure token is stored
        if (response.data.token) {
          authService.setToken(response.data.token);
          authService.setUserData(userData);
          
          setUser(userData);
          setIsAuthenticated(true);
          
          return response;
        } else {
          throw new Error('Token not received from server');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userType, userData) => {
    try {
      let response;
      
      if (userType === 'admin') {
        response = await authService.registerAdmin(userData);
      } else {
        response = await authService.registerEmployee(userData);
      }

      if (response.success && response.data) {
        const userInfo = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role || userType
        };

        // Ensure token is stored
        if (response.data.token) {
          authService.setToken(response.data.token);
          authService.setUserData(userInfo);
          
          setUser(userInfo);
          setIsAuthenticated(true);
          
          return response;
        } else {
          throw new Error('Token not received from server');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };
};

