import express from 'express';
import { signUp, verify_email, login } from '../controllers/authenticationController.js';

const loginRouter = express.Router();

loginRouter.route('/').get((req, res) => {
  res.status(200).json({ message: 'Welcome to the Kehila API' });
});

loginRouter.route('/signup').post(signUp);

loginRouter.route('/verifyEmail').post(verify_email);

loginRouter.route('/login').post(login);

//loginRouter.route('/verify-token').get(verifyToken);

export default loginRouter;
