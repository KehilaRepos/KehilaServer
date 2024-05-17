import pg from 'pg';
const { Pool } = pg;

export default class dbController {
  static instance;

  constructor() {
    if (dbController.instance) {
      return dbController.instance;
    }

    this.pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASS,
      port: process.env.POSTGRES_PORT * 1,
    
    });

    dbController.instance = this;
  }

  async does_email_exist(email) {
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const { row } = await this.read_pool.query(query, [email]);
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
      const { row } = await this.read_pool.query(query, [email, hashed_password]);
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
      const { row } = await this.read_pool.query(query, [email]);
      if (!row) {
        throw new Error('User not found');
      }
      return row[0];
    } catch (error) {
      throw error;
    }
  }
}
