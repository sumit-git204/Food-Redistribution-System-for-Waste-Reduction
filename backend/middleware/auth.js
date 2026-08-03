import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_eco_food_redistribution_key_2026');
      
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        req.orgId = req.user.orgId;
      } else {
        // Fallback to token decoded orgId
        req.orgId = decoded.orgId || '66abbc112233445566778899';
        req.user = { _id: decoded.id, role: decoded.role || 'business_admin', orgId: req.orgId };
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Fallback for development/testing if header not present or demo token used
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    req.orgId = '66abbc112233445566778899';
    req.user = {
      _id: '66abbc112233445566778890',
      name: 'Eco Fresh Market Admin',
      email: 'admin@ecofresh.com',
      role: 'business_admin',
      orgId: req.orgId
    };
    return next();
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};
