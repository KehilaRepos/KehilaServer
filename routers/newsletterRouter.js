import express from 'express';
import cors from 'cors';
import { get_newsletter, delete_newsletter_registration, register_to_newsletter } from '../controllers/newsletterController.js';
import { get_categories } from '../controllers/categoryController.js';
const newsletterRouter = express.Router();

newsletterRouter.use(cors());

newsletterRouter.route('').get(get_newsletter).post(register_to_newsletter).delete(delete_newsletter_registration);

newsletterRouter.route('categories').get(get_categories);

export default newsletterRouter;