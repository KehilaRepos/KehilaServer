import dbController from './dbController';
import md5 from 'md5';
import jasonwebtoken from 'jsonwebtoken';

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await dbController.does_email_exist(email);
//     const hashed_password = md5(password);
//     if (await dbController.check_login(email, hashed_password)) {

//   }
// }

class AuthenticationService {
  static instance;

  constructor(jwt_secret) {
    if (AuthenticationService.instance) {
      return AuthenticationService.instance;
    }

    this.jwtSecret = jwt_secret;

    AuthenticationService.instance = this;
  }

  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      await dbController.does_email_exist(email);
      const hashed_password = md5(password);
      await dbController.check_login(email, hashed_password);
      const role = await dbController.get_user_by_email(email)['role'];
      return jwt.sign({ email: email, role: role }, this.jwtSecret, {
        expiresIn: '3h',
      });
    } catch (error) {
      throw error;
    }
  }
}
