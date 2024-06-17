import { register_to_newsletter_service, delete_newsletter_registration_service, get_newsletter_service } from "../services/newsletterService.js";

export const register_to_newsletter = async (req, res) => {
    try {
        await register_to_newsletter_service(req.body);
        res.status(200).json({ success: true, message: 'Newsletter registration successful!.'});
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to register to newsletter' });
    }
}

export const delete_newsletter_registration = async (req, res) => {
    try {
        await delete_newsletter_registration_service(req.body);
        res.status(200).json({ success: true, message: 'Newsletter registration deleted successfully!.'});
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to delete newsletter registration' });
    }
}

export const get_newsletter = async (req, res) => {
    try {
        const newsletters = await get_newsletter_service(req.query);
        res.status(200).json({ success: true, message: 'Newsletter retrieved successfully.', data: newsletters });
    }
    catch (error) {
        res.status(200).json({ success: false, message: 'Failed to retrieve newsletters.' });
    }
}