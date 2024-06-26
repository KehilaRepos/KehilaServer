import dbService from "./dbService.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import { unlink } from 'fs/promises';

class Filter {
    constructor(column, processFunction = null) {
    	this.column = column;
    	this.process = processFunction || ((value) => value); // Default process is an identity function
    }
  
    apply(value) {
    	return this.process(value);
    }
}

const filters = {
    //title: new Filter('title', value => value.trim()), exapmle
    pid: new Filter('pid', value => value * 1),
    uid: new Filter('uid'),
    cid: new Filter('cid'),
    //location: new Filter('location'),
    expiration_time: new Filter('expiration_time'),
};

export const create_post_retreival_query = async (queryParams) => {
	try {
		let baseQuery = `SELECT * FROM posts`;
		const whereClauses = [];
		const values = [];
		if (queryParams.lat && queryParams.lng) {
			baseQuery = `SELECT *, ST_Distance(
			ST_SetSRID(location::geometry, 4326),
			ST_SetSRID(ST_MakePoint($1, $2), 4326)
			) AS distance
			FROM posts;
			`;
			values.push(queryParams.lat);
			values.push(queryParams.lng);
		}

		Object.entries(queryParams).forEach(([key, value]) => {
			const filter = filters[key];
			if (filter && value) {
			const processedValue = filter.apply(value);
			whereClauses.push(`${filter.column} = $${values.length + 1}`);
			//whereClauses.push(`${filter.column} = $${whereClauses.length + 1}`);
			values.push(processedValue);
			}
		});

		let orderBy = 'expiration_time';
		const query = whereClauses.length ? `${baseQuery} WHERE ${whereClauses.join(' AND ')} ORDER BY ${orderBy}` : baseQuery;
		
		return [query, values];

	} catch (error) {
		throw(error);
	}
};

const upload_post_to_db = async (req, has_image) => {
	try {
		const data = {
			email: req.body.user_email,
			cid: req.body.cid,
			title: req.body.title,
			description: req.body.description,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			expiration_time: req.body.expiration_time,
			target: req.body.target,
			contact_name: req.body.contact_name,
			contact_phone: req.body.contact_phone,
			contact_email: req.body.contact_email,
			facebook: req.body.facebook,
			instagram: req.body.instagram,
			twitter: req.body.twitter,
			website: req.body.website
		};
		if (!data.email || !data.cid || !data.title) {
			throw new Error('Missing required fields');
		}
		
		for (let value in data) {
			if (!data[value]) {
				data[value] = null;
			}
		}
		const query = `INSERT INTO posts (user_email, cid, title, description, location, expiration_time, target, contact_name, contact_phone, contact_email, facebook, instagram, twitter, website, has_image, creation_time) VALUES ($1, $2, $3, $4, Point($5, $6), $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP) RETURNING pid`;
		const queryValues = [data.email, data.cid, data.title, data.description, data.latitude, data.longitude, data.expiration_time, data.target, data.contact_name, data.contact_phone, data.contact_email, data.facebook, data.instagram, data.twitter, data.website, has_image];

		const queryResponse = await dbService.instance.pool.query(query, queryValues);

		return queryResponse.rows[0].pid;
	} catch (error) {
		throw error;
	}
}

export const upload_to_s3 = async (file, pid) => {
	try {
		const s3 = new S3Client({
			region: "us-east-1",
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				sessionToken: process.env.AWS_SESSION_TOKEN
			}
		});
		const fileStream = fs.createReadStream(file.path);

		const input = {
            Bucket: 'kehilaimagebucket',
            Key: `${pid}`,
            Body: fileStream
        };

		const command = new PutObjectCommand(input);
		await s3.send(command);
		await unlink(file.path);
	} catch (error) {
		throw error;
	}
}

export const create_post_service = async (req) => {
	try {

		let has_image = false;	
		if (req.file) {
			has_image = true;
		}

		const pid = await upload_post_to_db(req, has_image);

		if (req.file) {
			await upload_to_s3(req.file, pid);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}