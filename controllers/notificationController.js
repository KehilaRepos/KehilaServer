import { get_notification_service, create_notification_service } from "../services/notificationService.js";


export const get_notifications_controller = async (req, res) => {
    try {
        const notifications = await get_notification_service(req.query);
        res.status(200).json({ success: true, message: 'Notifications retrieved successfully.', data: notifications });
    }
    catch (error) {
        res.status(200).json({ success: false, message: 'Failed to retrieve notifications.' });
    }
}

export const create_notification_controller = async (req, res) => {
    try {
        //await create_notification_service(req.body);
        res.status(200).json({ success: true, message: 'Notification created successfully!.' });
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to create notification' });
    }
}