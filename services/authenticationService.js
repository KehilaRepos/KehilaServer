import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import validator from "validator";
import dbService from "./dbService.js";
const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const signup_service = async (email, password) => {
  try {
    if (!validator.isEmail(email)) {
      throw new Error('Please provide a valid email address.');
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error('Your password does not meet the required complexity standards. Ensure it is at least 8 characters and includes uppercase, lowercase, numeric, and special characters.');
    }
    const input = {
      ClientId: process.env.COGNITO_CLIENT_ID, 
      Username: email,
      Password: password,
    }
    const command = new SignUpCommand(input);
    const response = await client.send(command); 
    
    const query = 'INSERT INTO users (email, date) VALUES ($1, $2)';   
    await dbService.instance.pool.query(query, [email, new Date()]);

    return response;    
  } catch (error) {
    throw(error);
  }
}

export const verify_email_service = async (email, code) => {
  try {
    if (!validator.isEmail(email)) {
      throw new Error('Please provide a valid email address to proceed.');
    }
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    } 
    const command = new ConfirmSignUpCommand(params);
    const response = await client.send(command);
    return response;
  }
  catch(err) {    
    throw(err);
  }
}

export const resend_email_verification_service = async (email) => {
  try {
    if (!validator.isEmail(email)) {
      throw new InternalErrorException('Please provide a valid email address to proceed.');
    }
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    }
    const command = new ResendConfirmationCodeCommand(params);
    const response = await client.send(command);
    return response;
  } catch (error) {
    throw error;
  }
}

export const login_service = async (email, password) => {
  try {
    if (!validator.isEmail(email)) {
      throw new Error('Please enter a valid email address to log in.');
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
    return response;
  } catch (error) {
    throw error;
    // if (error.name === 'NotAuthorizedException') {
    //   throw new Error('The email address or password you entered is incorrect. Please try again.') ;
    // }
    // else if (error.name === 'UserNotConfirmedException') {
    //   throw new Error('Please verify your email address to proceed with login.');
    // }
  }
}

