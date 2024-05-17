import dotenv from 'dotenv/config';
import app from './app.js';
import dbController from './controllers/dbController.js';

const port = process.env.PORT * 1 || 8080;
app.listen(port, () => { 
  console.log(`Server running on http://localhost:${(port)}`);
  const db = new dbController(); //create the db controller connection
});
