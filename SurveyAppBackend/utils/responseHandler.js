// Utility functions for creating standardized API responses
const successResponse = (data = null, message = 'Success') => {
  return {
    status: 'ok',
    message,
    data
  };
};

const errorResponse = (message = 'Error', error = null) => {
  return {
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && error && { error })
  };
};

const paginatedResponse = (data, pagination) => {
  return {
    status: 'ok',
    data,
    pagination
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
