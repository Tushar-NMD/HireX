import { toast } from 'react-toastify';

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  let message = 'Something went wrong. Please try again.';
  
  if (error.response) {
    // Server responded with error status
    message = error.response.data?.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    // Request was made but no response received
    message = 'Network error. Please check your connection.';
  } else {
    // Something else happened
    message = error.message || message;
  }
  
  toast.error(message);
  return message;
};

export const handleApiSuccess = (message) => {
  toast.success(message);
};