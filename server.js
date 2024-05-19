import dotenv from 'dotenv/config';
import app from './app.js';
import dbService from "./services/dbService.js";

const port = process.env.PORT * 1 || 8080;
app.listen(port, () => { 
  console.log(`Server running on http://localhost:${(port)}`);
  const db = new dbService(); //create the db controller connection
});
