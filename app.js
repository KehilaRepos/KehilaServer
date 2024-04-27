import express from 'express';
import authentication_router from './routers/authenticationRouter.js';

const app = express();

//////////////////////////
//middlewares
//////////////////////////

app.use(express.json());

app.use('/auth', authentication_router);

export default app;
