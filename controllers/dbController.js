import { Pool } from 'postgres';

export default class dbController {
  static instance;

  constructor(db_config) {
    if (AuthenticationService.instance) {
      return AuthenticationService.instance;
    }

    this.pool = new Pool(dbConfig);

    AuthenticationService.instance = this;
  }

  async does_email_exist(email) {
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const { row } = await this.pool.query(query, [email]);
      const user = row[0];
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async check_login(email, hashed_password) {
    try {
      const query = `SELECT * FROM users WHERE email = $1 AND password = $2`;
      const { row } = await this.pool.query(query, [email, hashed_password]);
      const user = row[0];
      if (!user) {
        throw new Error('Invalid login credentials');
      }
    } catch (error) {
      throw error;
    }
  }

  async get_user_by_email(email) {
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const { row } = await this.pool.query(query, [email]);
      if (!row) {
        throw new Error('User not found');
      }
      return row[0];
    } catch (error) {
      throw error;
    }
  }
}
