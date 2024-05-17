import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import validator from "validator";
const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(200).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(200).json({ success: false, message: 'Your password does not meet the required complexity standards. Ensure it is at least 8 characters and includes uppercase, lowercase, numeric, and special characters.' });
    }
    const input = {
      ClientId: process.env.COGNITO_CLIENT_ID, 
      Username: email,
      Password: password,
    }
    const command = new SignUpCommand(input);
    const response = await client.send(command);
    res.status(200).json({ success: true, message: 'Welcome to KEHILA! Your user account has been successfully created.  We have sent a validation email to your address. Please check your inbox to complete registration.', response });
  } catch (error) {
    res.status(200).json({ success: false, message: 'We encountered an issue while creating your account. Please try again.', error });
  }
}

export const verify_email = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(200).json({ success: false, message: 'Please provide a valid email address to proceed.' });
    }
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    } 
    const command = new ConfirmSignUpCommand(params);
    const response = await client.send(command);
    
    res.status(200).json({ success: true, message: 'Your email has been verified successfully!' });
  } catch (error) {
    res.status(200).json({ success: false, message: 'Failed to verify email. Please check your details and try again.', error });
  }
}

export const resend_email_verification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(200).json({ success: false, message: 'Please provide a valid email address to proceed.' });
    }
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    }
    const command = new ResendConfirmationCodeCommand(params);
    const response = await client.send(command);
    res.status(200).json({ success: true, message: 'Verification email resent successfully!' });
  } catch (error) {
    res.status(200).json({ success: false, message: 'Failed to resend verification email. Please check your details and try again.', error });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status
      (200).json({ success: false, message: 'Please enter a valid email address to log in.' });
    }
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID, 
      AuthParameters: {
          USERNAME: email,
          PASSWORD: password
      },
  };
    const command = new InitiateAuthCommand(params);
    const response = await client.send(command);
    const accessToken = response.AuthenticationResult.AccessToken;
    //const idToken = response.AuthenticationResult.IdToken;
    //const refreshToken = response.AuthenticationResult.RefreshToken;
    //need to return some or all of these tokens to client side, need to decide how to store them
    res.status(200).json({ success: true, message: 'Sign-in successful. Welcome back!', token: accessToken });
  } catch (error) {
    if (error.name === 'NotAuthorizedException') {
      res.status(200).json({ success: false, message: 'The email address or password you entered is incorrect. Please try again.' });
      return;
    }
    if (error.name === 'UserNotConfirmedException') {
      res.status(200).json({ success: false, message: 'Please verify your email address to proceed with login.' });
      return;
    }
    else {
      res.status(200).json({ success: false, message: 'An error occurred during the sign-in process. Please try again later.' });
      return;
    }
  }
}

export const verify_token = async (req, res) => {
  try {
    const { token } = req.body;
    const params = {
      AccessToken: token,
    }
    const command = new GetUserCommand(params);
    console.log(command);

    const response = await client.send(command);
    res.status(200).json({ success: true, message: 'Token is valid.'});
  } catch (error) {
    res.status(200).json({ success: false, message: 'Token is invalid.', error });
  }
}
