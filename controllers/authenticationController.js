import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { signup_service, verify_email_service, resend_email_verification_service, login_service } from "../services/authenticationService.js";
import validator from "validator";
//const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await signup_service(email, password);
    res.status(200).json({ success: true, message: 'Welcome to KEHILA! Your user account has been successfully created.  We have sent a validation email to your address. Please check your inbox to complete registration.', response });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message || 'We encountered an issue while creating your account. Please try again.', error });
  }
}

export const verify_email = async (req, res) => {
  try {
    const { email, code } = req.body;   
    const response = await verify_email_service(email, code);
    res.status(200).json({ success: true, message: 'Your email has been verified successfully!' });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message || 'Failed to verify email. Please check your details and try again.', error });
  }
}

export const resend_email_verification = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await resend_email_verification_service(email);
    res.status(200).json({ success: true, message: 'Verification email resent successfully!' });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message || 'Failed to resend verification email. Please check your details and try again.', error });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await login_service(email, password);
    const accessToken = response.AuthenticationResult.AccessToken;
    //const idToken = response.AuthenticationResult.IdToken;
    //const refreshToken = response.AuthenticationResult.RefreshToken;
    //need to return some or all of these tokens to client side, need to decide how to store them
    res.status(200).json({ success: true, message: 'Sign-in successful. Welcome back!', token: accessToken });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message || 'An error occurred during the sign-in process. Please try again later.'});
  }
}

export const verify_token = async (req, res) => {
  try {
    const { token } = req.body;
    const params = {
      AccessToken: token,
    }
    const command = new GetUserCommand(params);
    const response = await client.send(command);
    res.status(200).json({ success: true, message: 'Token is valid.'});
  } catch (error) {
    res.status(200).json({ success: false, message: 'Token is invalid.', error });
  }
}
