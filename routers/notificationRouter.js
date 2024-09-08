import express from 'express';
import cors from 'cors';
import { get_notifications_controller, create_notification_controller, is_read_set_true_notification, is_read_set_true_for_user_notification } from '../controllers/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.use(cors());

notificationRouter.route('').get(get_notifications_controller).post(create_notification_controller);

notificationRouter.route('/read').post(is_read_set_true_notification);

notificationRouter.route('/read/user').post(is_read_set_true_for_user_notification);

export default notificationRouter;