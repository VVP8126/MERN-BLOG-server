import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidator, loginValidator } from './utils/validations/auth.js';
import { postValidator } from './utils/validations/post.js';
import checkAuth from './utils/authorization/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import validationErrorsHandler from './utils/validations/validationErrorsHandler.js';

mongoose
  .connect('mongodb://127.0.0.1:27017/mern_project')
  .then(() => {
    console.log('Connection with DB <mern_project> set up !');
  })
  .catch(() => {
    console.log('Failed set up connection with DB !');
  });

const application = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

application.use(express.json());
application.use('/uploads', express.static('uploads'));

application.get('/user', checkAuth, UserController.getUser);
application.post('/login', loginValidator, validationErrorsHandler, UserController.login);
application.post('/register', registerValidator, validationErrorsHandler, UserController.register);
application.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

application.get('/posts', PostController.getAll);
application.get('/posts/:id', PostController.getOne);
application.post(
  '/posts',
  checkAuth,
  postValidator,
  validationErrorsHandler,
  PostController.create,
);
application.delete('/posts/:id', checkAuth, PostController.remove);
application.patch(
  '/posts/:id',
  checkAuth,
  postValidator,
  validationErrorsHandler,
  PostController.update,
);

application.listen(7777, (error) => {
  if (error) {
    return console.log('Error while launching Web Server');
  }
  console.log('Server started at PORT 7777');
});

// mongodb://127.0.0.1:27017/mern_project
