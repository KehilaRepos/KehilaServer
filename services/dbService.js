import pg from 'pg';
const { Pool } = pg;

//import { pool } from './serviceUtils.js'

export default class dbService {
  static instance;

  constructor() {
    if (dbService.instance) {
      return dbService.instance;
    }

    this.pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASS,
      port: process.env.POSTGRES_PORT * 1,
    
    });

    dbService.instance = this;
    return dbService.instance;
  }

  async execute_dynamic_query(query, values) {
    try {
      const { rows } = await this.pool.query(query, values);
      return rows;
    } catch (error) {
      throw error;
    }
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
  
}
