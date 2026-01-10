import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js'; // ✅ Don't forget this

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    // Duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(errorHandler(409, `User with that ${field} already exists.`));
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    // ✅ Flatten user + token
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ ...rest, token });

  } catch (error) {
    next(error);
  }
};
export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('User signed out successfully!');
};
