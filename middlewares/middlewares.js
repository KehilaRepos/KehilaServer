import { validateAccessToken } from ".middlewaresUtils.js";

export const authenticateUser = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1]; 
    // Bearer Token, authentication header will be of the following format: Authorization: Bearer YOUR_ACCESS_TOKEN
    if (!accessToken) {
      return res.status(401).json({ message: "No access token provided" });
    }
  
    const userAttributes = await validateAccessToken(accessToken);
    if (userAttributes) {
      req.user = userAttributes; // Attach user attributes to the request object
      next(); // Continue to the next middleware/route handler
    } else {
      res.status(401).json({ message: "Invalid or expired access token" });
    }
  };