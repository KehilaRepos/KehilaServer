import express from 'express';
import cors from 'cors';
import { get_categories } from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.use(cors());

categoryRouter.route('').get(get_categories);



export default categoryRouter;