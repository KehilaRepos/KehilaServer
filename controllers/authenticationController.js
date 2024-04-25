import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import validator from "validator";
const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
    }
    const input = {
      ClientId: "j346v3emmgseoaju4cs99b94m", 
      Username: email,
      Password: password,
    }
    const command = new SignUpCommand(input);
    const response = await client.send(command);
    res.status(200).json({ message: 'User created successfully', response });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user ', error });
  }
}

export const verify_email = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    const params = {
      ClientId: "j346v3emmgseoaju4cs99b94m",
      Username: email,
      ConfirmationCode: code,
    } 
    const command = new ConfirmSignUpCommand(params);
    const response = await client.send(command);
    
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email ', error });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status
      (400).json({ message: 'Invalid email address' });
    }
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: "j346v3emmgseoaju4cs99b94m", 
      AuthParameters: {
          USERNAME: email,
          PASSWORD: password
      },
  };
    const command = new InitiateAuthCommand(params);
    const response = await client.send(command);
    const accessToken = response.AuthenticationResult.AccessToken;
    const idToken = response.AuthenticationResult.IdToken;
    const refreshToken = response.AuthenticationResult.RefreshToken;
    //need to return some or all of these tokens to client side, need to decide how to store them
    res.status(200).json({ message: 'Sign in successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in ', error });
  }
}



