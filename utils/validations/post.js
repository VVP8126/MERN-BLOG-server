import { body } from 'express-validator';

export const postValidator = [
  body('title', 'Enter TITLE (at list 3 symbols)').isLength({ min: 3 }).isString(),
  body('text', 'Enter TEXT (at list 10 symbols)').isLength({ min: 10 }).isString(),
  body('tags', 'Invalid TAG format (array)').optional().isArray(),
  body('imageUrl', 'Invalid IMAGE link').optional().isString(),
];
