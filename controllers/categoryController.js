import { get_categories_service } from "../services/categoryService.js";

export const get_categories = async (req, res) => {
    try {
        const categories = await get_categories_service(req.query);
        res.status(200).json({ success: true, message: 'Categories retrieved successfully.', data: categories });
    } catch (error) {
        console.log(error);
        res.status(200).json({ success: false, message: 'Failed to retrieve categories' });
    }
}