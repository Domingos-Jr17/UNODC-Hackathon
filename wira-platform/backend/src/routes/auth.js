const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Import models (will be created with database schema)
const { User, Organization } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validateRequest } = require('../middleware/validation');

// Validation schemas
const loginSchema = Joi.object({
  accessCode: Joi.string().pattern(/^V\d{4}$/).required().messages({
    'string.pattern.base': 'Access code must be in format V#### (e.g., V0042)'
  })
});

const orgLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  organizationName: Joi.string().min(2).required(),
  registrationNumber: Joi.string().required(),
  contactPhone: Joi.string().required(),
  address: Joi.string().required()
});

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Login with access code (victim)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateRequest(loginSchema), asyncHandler(async (req, res) => {
  const { accessCode } = req.body;

  // Find user by access code
  const user = await User.findOne({ 
    where: { accessCode },
    include: [{
      model: User.Scope,
      attributes: ['id', 'name', 'type']
    }]
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid access code. Please contact your organization for assistance.',
      errorCode: 'INVALID_ACCESS_CODE'
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated. Please contact your organization.',
      errorCode: 'ACCOUNT_DEACTIVATED'
    });
  }

  // Update last login
  await user.update({ 
    lastLoginAt: new Date(),
    loginCount: (user.loginCount || 0) + 1
  });

  // Generate token
  const token = generateToken({
    id: user.id,
    accessCode: user.accessCode,
    userType: 'victim',
    scopeId: user.scopeId
  });

  // Mask sensitive data for response
  const userResponse = {
    id: user.id,
    accessCode: user.accessCode,
    userType: 'victim',
    scope: user.Scope,
    enrolledAt: user.enrolledAt,
    lastLoginAt: user.lastLoginAt
  };

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  });
}));

// @desc    Organization login
// @route   POST /api/auth/org-login
// @access  Public
router.post('/org-login', validateRequest(orgLoginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find organization
  const organization = await Organization.findOne({
    where: { email },
    include: [{
      model: Organization.User,
      attributes: ['id', 'name', 'email', 'role', 'lastLoginAt']
    }]
  });

  if (!organization) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      errorCode: 'INVALID_CREDENTIALS'
    });
  }

  if (!organization.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Organization account is deactivated',
      errorCode: 'ORGANIZATION_DEACTIVATED'
    });
  }

  // Check password (assuming organization has a primary user or password field)
  const isValidPassword = await bcrypt.compare(password, organization.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      errorCode: 'INVALID_CREDENTIALS'
    });
  }

  // Update last login
  await organization.update({ lastLoginAt: new Date() });

  // Generate token
  const token = generateToken({
    id: organization.id,
    email: organization.email,
    userType: 'organization',
    organizationId: organization.id
  });

  const orgResponse = {
    id: organization.id,
    name: organization.name,
    email: organization.email,
    registrationNumber: organization.registrationNumber,
    userType: 'organization',
    lastLoginAt: organization.lastLoginAt
  };

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      organization: orgResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  });
}));

// @desc    Register new organization
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRequest(registerSchema), asyncHandler(async (req, res) => {
  const {
    email,
    password,
    organizationName,
    registrationNumber,
    contactPhone,
    address
  } = req.body;

  // Check if organization already exists
  const existingOrg = await Organization.findOne({
    where: {
      $or: [{ email }, { registrationNumber }]
    }
  });

  if (existingOrg) {
    return res.status(400).json({
      success: false,
      message: 'Organization with this email or registration number already exists',
      errorCode: 'ORGANIZATION_EXISTS'
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Generate verification token
  const verificationToken = uuidv4();

  // Create organization
  const organization = await Organization.create({
    name: organizationName,
    email,
    registrationNumber,
    contactPhone,
    address,
    passwordHash,
    verificationToken,
    isActive: false, // Requires admin approval
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // TODO: Send verification email
  // await emailService.sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    success: true,
    message: 'Organization registered successfully. Please check your email for verification.',
    data: {
      id: organization.id,
      name: organization.name,
      email: organization.email,
      registrationNumber: organization.registrationNumber
    }
  });
}));

// @desc    Verify email
// @route   POST /api/auth/verify
// @access  Public
router.post('/verify', asyncHandler(async (req, res) => {
  const { token } = req.body;

  const organization = await Organization.findOne({
    where: { verificationToken: token }
  });

  if (!organization) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token',
      errorCode: 'INVALID_TOKEN'
    });
  }

  await organization.update({
    verificationToken: null,
    isActive: true,
    emailVerifiedAt: new Date()
  });

  res.json({
    success: true,
    message: 'Email verified successfully. Your organization is now pending admin approval.'
  });
}));

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
router.post('/refresh', asyncHandler(async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
      errorCode: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Generate new token
    const newToken = generateToken({
      id: decoded.id,
      userType: decoded.userType,
      scopeId: decoded.scopeId,
      organizationId: decoded.organizationId
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      errorCode: 'INVALID_TOKEN'
    });
  }
}));

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', asyncHandler(async (req, res) => {
  // TODO: Implement token blacklisting with Redis
  // await redis.set(`blacklist:${token}`, 'true', 'EX', 86400); // 24 hours

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', asyncHandler(async (req, res) => {
  // This would be protected by auth middleware
  const user = req.user;

  if (user.userType === 'victim') {
    const userData = await User.findByPk(user.id, {
      include: [{
        model: User.Scope,
        attributes: ['id', 'name', 'type']
      }]
    });

    return res.json({
      success: true,
      data: {
        user: {
          id: userData.id,
          accessCode: userData.accessCode,
          userType: 'victim',
          scope: userData.Scope,
          enrolledAt: userData.enrolledAt,
          lastLoginAt: userData.lastLoginAt
        }
      }
    });
  } else {
    const orgData = await Organization.findByPk(user.id, {
      attributes: ['id', 'name', 'email', 'registrationNumber', 'isActive']
    });

    return res.json({
      success: true,
      data: {
        organization: {
          ...orgData.toJSON(),
          userType: 'organization'
        }
      }
    });
  }
}));

module.exports = router;
