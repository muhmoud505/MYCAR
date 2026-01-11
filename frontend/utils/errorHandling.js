// Error handling utility for better user experience and debugging

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN', statusCode = 500, isServerError = false) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.isServerError = isServerError
  }
}

export const ERROR_CODES = {
  // Network/Server errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  
  // Validation errors
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  
  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.',
  [ERROR_CODES.SERVER_ERROR]: 'Server error occurred. Please try again later.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid email or password. Please try again.',
  [ERROR_CODES.EMAIL_NOT_FOUND]: 'No account found with this email address.',
  [ERROR_CODES.EMAIL_ALREADY_EXISTS]: 'An account with this email already exists.',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.TOKEN_INVALID]: 'Invalid session. Please log in again.',
  [ERROR_CODES.NOT_AUTHORIZED]: 'You are not authorized to perform this action.',
  
  [ERROR_CODES.INVALID_EMAIL]: 'Please enter a valid email address.',
  [ERROR_CODES.INVALID_PASSWORD]: 'Password is invalid.',
  [ERROR_CODES.PASSWORD_TOO_SHORT]: 'Password must be at least 6 characters long.',
  [ERROR_CODES.REQUIRED_FIELD]: 'This field is required.',
  
  [ERROR_CODES.USER_NOT_FOUND]: 'User account not found.',
  [ERROR_CODES.ACCOUNT_LOCKED]: 'Your account has been locked. Please contact support.',
  [ERROR_CODES.EMAIL_NOT_VERIFIED]: 'Please verify your email address before logging in.',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
}

export function parseApiError(error) {
  console.error('API Error Details:', {
    message: error.message,
    response: error.response,
    status: error.response?.status,
    data: error.response?.data,
    stack: error.stack
  })

  // Handle network errors
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return new AppError(
        ERROR_MESSAGES[ERROR_CODES.TIMEOUT_ERROR],
        ERROR_CODES.TIMEOUT_ERROR,
        408,
        true
      )
    }
    return new AppError(
      ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      ERROR_CODES.NETWORK_ERROR,
      0,
      true
    )
  }

  const status = error.response.status
  const data = error.response.data

  // Handle different HTTP status codes
  switch (status) {
    case 400:
      return new AppError(
        data?.error || ERROR_MESSAGES[ERROR_CODES.REQUIRED_FIELD],
        ERROR_CODES.REQUIRED_FIELD,
        400
      )
    
    case 401:
      if (data?.error?.includes('Invalid credentials')) {
        return new AppError(
          ERROR_MESSAGES[ERROR_CODES.INVALID_CREDENTIALS],
          ERROR_CODES.INVALID_CREDENTIALS,
          401
        )
      }
      if (data?.error?.includes('expired')) {
        return new AppError(
          ERROR_MESSAGES[ERROR_CODES.TOKEN_EXPIRED],
          ERROR_CODES.TOKEN_EXPIRED,
          401
        )
      }
      return new AppError(
        data?.error || ERROR_MESSAGES[ERROR_CODES.NOT_AUTHORIZED],
        ERROR_CODES.NOT_AUTHORIZED,
        401
      )
    
    case 403:
      return new AppError(
        data?.error || ERROR_MESSAGES[ERROR_CODES.NOT_AUTHORIZED],
        ERROR_CODES.NOT_AUTHORIZED,
        403
      )
    
    case 404:
      return new AppError(
        data?.error || ERROR_MESSAGES[ERROR_CODES.USER_NOT_FOUND],
        ERROR_CODES.USER_NOT_FOUND,
        404
      )
    
    case 409:
      return new AppError(
        data?.error || ERROR_MESSAGES[ERROR_CODES.EMAIL_ALREADY_EXISTS],
        ERROR_CODES.EMAIL_ALREADY_EXISTS,
        409
      )
    
    case 500:
    case 502:
    case 503:
    case 504:
      return new AppError(
        data?.error || ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR],
        ERROR_CODES.SERVER_ERROR,
        status,
        true
      )
    
    default:
      return new AppError(
        data?.error || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
        ERROR_CODES.UNKNOWN_ERROR,
        status,
        status >= 500
      )
  }
}

export function getErrorMessage(error) {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error?.message) {
    return error.message
  }
  
  return ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]
}

export function isServerError(error) {
  return error?.isServerError || false
}

// Validation helpers
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    throw new AppError(ERROR_MESSAGES[ERROR_CODES.REQUIRED_FIELD], ERROR_CODES.REQUIRED_FIELD)
  }
  if (!emailRegex.test(email)) {
    throw new AppError(ERROR_MESSAGES[ERROR_CODES.INVALID_EMAIL], ERROR_CODES.INVALID_EMAIL)
  }
  return true
}

export function validatePassword(password) {
  if (!password) {
    throw new AppError(ERROR_MESSAGES[ERROR_CODES.REQUIRED_FIELD], ERROR_CODES.REQUIRED_FIELD)
  }
  if (password.length < 6) {
    throw new AppError(ERROR_MESSAGES[ERROR_CODES.PASSWORD_TOO_SHORT], ERROR_CODES.PASSWORD_TOO_SHORT)
  }
  return true
}

export function validateRequired(value, fieldName) {
  if (!value || value.trim() === '') {
    throw new AppError(`${fieldName} is required`, ERROR_CODES.REQUIRED_FIELD)
  }
  return true
}
