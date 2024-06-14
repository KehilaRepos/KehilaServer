import express from 'express';
import cors from 'cors';
import { signup, verify_email, login, resend_email_verification, verify_token } from '../controllers/authenticationController.js';

const loginRouter = express.Router();

loginRouter.use(cors());

loginRouter.route('/signup').post(signup);

loginRouter.route('/verifyEmail').post(verify_email);

loginRouter.route('/login').post(login);

loginRouter.route('/resendEmailVerification').post(resend_email_verification);

loginRouter.route('/verifyToken').post(verify_token);

export default loginRouter;
