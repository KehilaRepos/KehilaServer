import express from 'express';
import { signUp, signIn } from '../controllers/loginController.js';

const loginRouter = express.Router();

loginRouter.route('/').get((req, res) => {
  res.status(200).json({ message: 'Welcome to the Kehila API' });
});

loginRouter.route('/register').post(signUp);

loginRouter.route('/login').get(signIn);

//loginRouter.route('/verify-token').get(verifyToken);

export default loginRouter;
