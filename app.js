import express from 'express';
import loginRouter from './routers/loginRouter.js';

const app = express();

//////////////////////////
//middlewares
//////////////////////////

app.use(express.json());

app.use('/login', loginRouter);

export default app;
