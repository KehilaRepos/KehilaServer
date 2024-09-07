import express from 'express';
import cors from 'cors';
import { get_posts, create_post, delete_post, patch_post, update_views_post } from '../controllers/postController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });


const postRouter = express.Router();

postRouter.use(cors());

postRouter.route('').get(get_posts).post(upload.single('file'), create_post).delete(delete_post).patch(patch_post);

postRouter.route('/views').post(update_views_post);

export default postRouter;
