import express from 'express';
import cors from 'cors';
import { get_notifications_controller, create_notification_controller } from '../controllers/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.use(cors());

notificationRouter.route('').get(get_notifications_controller).post(create_notification_controller);

export default notificationRouter;