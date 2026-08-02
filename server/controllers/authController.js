import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Organization from '../models/Organization.js';

const generateToken = (id, orgId, role) => {
  return jwt.sign({ id, orgId, role }, process.env.JWT_SECRET || 'super_secret_eco_food_redistribution_key_2026', {
    expiresIn: '30d'
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, orgName, orgType, businessType } = req.body;

    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create Organization first
    const org = await Organization.create({
      name: orgName || `${name}'s Organization`,
      type: orgType || 'business',
      businessType: businessType || 'Supermarket',
      contactEmail: email
    });

    const user = await User.create({
      name,
      email,
      password,
      role: orgType === 'ngo' ? 'ngo_admin' : 'business_admin',
      orgId: org._id
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      orgId: org._id,
      orgName: org.name,
      token: generateToken(user._id, org._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('orgId');
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId._id,
        orgName: user.orgId.name,
        token: generateToken(user._id, user.orgId._id, user.role)
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('orgId');
    if (user) {
      res.json(user);
    } else {
      res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        orgId: { _id: req.orgId, name: 'Eco Fresh Store' }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
