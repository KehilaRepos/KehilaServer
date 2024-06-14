import { create_post_retreival_query, create_post_service } from "../services/postService.js";
import dbService from "../services/dbService.js";


export const get_posts = async (req, res) => {
    try {
        const [query, values] = await create_post_retreival_query(req.query)
        const posts = await dbService.instance.execute_dynamic_query(query, values);
        res.status(200).json({ success: true, message: 'Posts retrieved successfully.', data: posts });
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ success: false, message: 'Failed to retrieve posts.' });
    }
}

export const create_post = async (req, res) => {
    try {
        await create_post_service(req);
        res.status(200).json({ success: true, message: 'Post created successfully!.'});
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to create post' });
        
    }
}

