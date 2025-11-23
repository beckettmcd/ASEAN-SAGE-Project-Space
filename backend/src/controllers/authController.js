import { User, Organisation } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, organisationId } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'Implementer',
      organisationId
    });

    const token = generateToken(user);

    res.status(201).json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Organisation, as: 'organisation' }]
    });

    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    const token = generateToken(user);

    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Organisation, as: 'organisation' }]
    });

    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

