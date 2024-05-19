import express from 'express';
import cors from 'cors';
import { get_posts } from '../controllers/postController.js';

const postRouter = express.Router();

postRouter.use(cors());

postRouter.route('').get(get_posts);



export default postRouter;
