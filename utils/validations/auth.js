import { body } from 'express-validator';

export const loginValidator = [
  body('email', 'Invalid EMAIL format').isEmail(),
  body('password', 'Minimal password length is 5 symbols').isLength({ min: 5 }),
];

export const registerValidator = [
  body('email', 'Invalid EMAIL format').isEmail(),
  body('password', 'Minimal password length is 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Minimal length of FULLNAME is 2').isLength({ min: 2 }),
  body('avatarUrl', 'Invalid AVATAR link').optional().isURL(),
];
