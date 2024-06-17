import express from 'express';
import cors from 'cors';
import { get_zones, get_availability, get_newsletter, delete_newsletter_registration, register_to_newsletter } from '../controllers/newsletterController.js';
const newsletterRouter = express.Router();

newsletterRouter.use(cors());

newsletterRouter.route('').get(get_newsletter).post(register_to_newsletter).delete(delete_newsletter_registration);

newsletterRouter.route('zones').get(get_zones);

newsletterRouter.route('availability').get(get_availability);


export default newsletterRouter;