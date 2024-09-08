import express from 'express';
import authentication_router from './routers/authenticationRouter.js';
import post_router from './routers/postRouter.js';
import category_router from './routers/categoryRouter.js';
import newsletter_router from './routers/newsletterRouter.js';
import notification_router from './routers/notificationRouter.js';
const app = express();

//////////////////////////
//middlewares
//////////////////////////

app.use(express.json());

app.route('/').get((req, res) => {
    res.status(200).json({ message: 'Welcome to the Kehila API' });
});

app.use('/auth', authentication_router);

app.use('/post', post_router);

app.use('/categories', category_router);

app.use('/newsletter', newsletter_router);

app.use('/notification', notification_router);

export default app;
