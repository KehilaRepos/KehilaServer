import { create_post_query } from "../services/postService.js";
import dbService from "../services/dbService.js";

export const get_posts = async (req, res) => {
    try {
        const [query, values] = await create_post_query(req.query)
        const posts = await dbService.instance.execute_dynamic_query(query, values);
        res.status(200).json({ success: true, message: 'Posts retrieved successfully.', data: posts });
    }
    catch (error) {
        res.status(200).json({ success: false, message: 'Failed to retrieve posts.' });
    }
}
