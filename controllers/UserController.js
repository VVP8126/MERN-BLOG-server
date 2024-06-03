import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/User.js';

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { passwordHash, ...data } = user._doc;
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Access denied !' });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'Wrong password or name' });
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPassword) {
      console.log('Wrong password');
      return res.status(400).json({ message: 'Wrong password or name' });
    }
    const token = jwt.sign({ _id: user._id }, 'Very_Secret!_Key-1', { expiresIn: '1d' });
    const { passwordHash, ...data } = user._doc;

    res.json({ ...data, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server error ! Failed to login !',
    });
  }
};

export const register = async (req, res) => {
  try {
    console.log(req.body);
    const password = req.body.password;
    const salt = await bcrypt.genSalt(8);
    const passHash = await bcrypt.hash(password, salt);

    const document = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: passHash,
    });

    const user = await document.save();
    const token = jwt.sign({ _id: user._id }, 'Very_Secret!_Key-1', { expiresIn: '1d' });
    const { passwordHash, ...data } = user._doc;

    res.json({ ...data, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Failed to register new USER. Server error !',
    });
  }
};
