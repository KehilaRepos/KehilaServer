import express from 'express';
import cors from 'cors';
import { get_posts, create_post } from '../controllers/postController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });


const postRouter = express.Router();

postRouter.use(cors());

postRouter.route('').get(get_posts).post(upload.single('file'), create_post);



export default postRouter;
