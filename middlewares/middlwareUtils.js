import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

// Initialize the Cognito client
const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

export const validateAccessToken = async (accessToken) => {
  try {
    const command = new GetUserCommand({
      AccessToken: accessToken // The access token from the user's request
    });
    const response = await client.send(command);
    return response; // The response includes the user's attributes if the token is valid
  } catch (error) {
    if (error.name === 'NotAuthorizedException') {
      // The token is invalid or expired
      return null;
    }
    throw error; // Other errors should be handled appropriately
  }
};