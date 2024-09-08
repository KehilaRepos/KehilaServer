import { create_post_retreival_query, create_post_service, delete_post_service, patch_post_service, update_views_post_service, update_likes_post_service } from "../services/postService.js";
import dbService from "../services/dbService.js";


export const get_posts = async (req, res) => {
    try {
        const posts = await create_post_retreival_query(req.query)
        //const posts = await dbService.instance.execute_dynamic_query(query, values);
        res.status(200).json({ success: true, message: 'Posts retrieved successfully.', data: posts, query: req.query});
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

export const delete_post = async (req, res) => {
    try {
        await delete_post_service(req.body.pid);
        res.status(200).json({ success: true, message: 'Post deleted successfully!.'});
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to delete post' });
    }
}

export const patch_post = async (req, res) => {
    try {
        await patch_post_service(req);
        res.status(200).json({ success: true, message: 'Post updated successfully!.'});
    } catch (error) {
        res.status(200).json({ success: false, message: 'Failed to update post' });
    }
}

export const update_views_post = async (req, res) => {
    try {
        await update_views_post_service(req);
        res.status(200).json({ success: true, message: 'Post views updated successfully!.'});
    }
    catch (error) { 
        res.status(200).json({ success: false, message: 'Failed to update post views' });
    }
}    

export const update_likes_post = async (req, res) => {
    try {
        await update_likes_post_service(req);
        res.status(200).json({ success: true, message: 'Post likes updated successfully!.'});
    }
    catch (error) { 
        res.status(200).json({ success: false, message: 'Failed to update post likes' });
    }
}
