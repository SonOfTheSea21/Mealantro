// account.js
const express = require('express');
const router = express.Router();

// Middleware function to initialize the client
const middleware = (client) => {
    return (req, res, next) => {
        req.client = client;
        next();
    };
};

router.get('/:id', async (req, res) => {
    try {
        console.log('trying to get feed')

        const id = req.params.id;
        const response = await req.client.query(
            `SELECT t.thread_id, t.description, t."timestamp", t.likes, t.media_1, t.media_2, t.media_3, t.poster_id,
            u.firstname AS firstname,
            u.lastname AS lastname,
            u.user_id AS user_id,
            u.user_photo AS user_photo,
            CASE WHEN tl.thread_id IS NULL THEN false ELSE true END AS liked_by_user
     FROM (
         SELECT t.thread_id, t.description, t."timestamp", t.likes, t.media_1, t.media_2, t.media_3, t.user_id AS poster_id
         FROM thread t
         WHERE t.user_id = $1
         UNION
         SELECT t.thread_id, t.description, t."timestamp", t.likes, t.media_1, t.media_2, t.media_3, t.user_id AS poster_id
         FROM thread t
         JOIN followers f ON t.user_id = f.user_id
         WHERE f.follower_id = $1
     ) AS t
     JOIN users u ON t.poster_id = u.user_id
     LEFT JOIN Thread_likes tl ON t.thread_id = tl.thread_id AND tl.user_id = $1
     ORDER BY t."timestamp" DESC;
     
     
     `, [id]
        );

        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
                data: response.rows
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No threads found for the user or user not found."
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.get('/timeline/:oid/:id', async (req, res) => {
    try {
        console.log('trying to get feed')

        const {oid,id} = req.params;
        const response = await req.client.query(
            `
            SELECT t.thread_id, t.description, t."timestamp", t.likes, t.media_1, t.media_2, t.media_3, t.user_id as poster_id,
            u.firstname AS firstname,
            u.lastname AS lastname,
            u.user_id AS user_id,
            u.user_photo AS user_photo,
            CASE WHEN tl.thread_id IS NULL THEN false ELSE true END AS liked_by_user
            FROM thread t
            JOIN users u ON t.user_id = u.user_id
            LEFT JOIN Thread_likes tl ON t.thread_id = tl.thread_id AND tl.user_id = $1
            WHERE t.user_id = $1
            ORDER BY t."timestamp" DESC;  
     `, [oid]
        );

        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
                data: response.rows
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No threads found for the user or user not found."
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.get('/timeline/:id', async (req, res) => {
    try {
        console.log('trying to get feed')

        const id = req.params.id;
        const response = await req.client.query(
            `
            SELECT t.thread_id, t.description, t."timestamp", t.likes, t.media_1, t.media_2, t.media_3, t.user_id as poster_id,
            u.firstname AS firstname,
            u.lastname AS lastname,
            u.user_id AS user_id,
            u.user_photo AS user_photo,
            CASE WHEN tl.thread_id IS NULL THEN false ELSE true END AS liked_by_user
            FROM thread t
            JOIN users u ON t.user_id = u.user_id
            LEFT JOIN Thread_likes tl ON t.thread_id = tl.thread_id AND tl.user_id = $1
            WHERE t.user_id = $1
            ORDER BY t."timestamp" DESC;  
     `, [id]
        );

        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
                data: response.rows
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No threads found for the user or user not found."
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.delete('/delete/:tid', async (req, res) => {
    try {
        const { tid } = req.params;

        // Delete the corresponding thread from the thread table
        const response = await req.client.query(
            `DELETE FROM thread WHERE thread_id = $1`,
            [tid]
        );

        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
                message: `Thread with ID ${tid} deleted successfully.`
            });
        } else {
            return res.status(404).json({
                success: false,
                message: `Thread with ID ${tid} not found.`
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.delete('/comment/delete/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        console.log('in comment delete')
        // Delete the corresponding thread from the thread table
        const response = await req.client.query(
            `DELETE FROM comment WHERE comment_id = $1`,
            [cid]
        );


        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
                message: `Thread with ID ${cid} deleted successfully.`
            });
        } else {
            return res.status(404).json({
                success: false,
                message: `Thread with ID ${cid} not found.`
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.post('/:id', async (req, res) => {
    try {
        const thread = req.body.thread;
        const id = req.params.id;
        // Assuming your database supports auto-generating timestamps,
        // otherwise, you can manually create the timestamp here.
        const timestamp = new Date(); 

        // Insert the thread into the threads table
        const response = await req.client.query(
            `INSERT INTO thread (description, "timestamp", user_id,likes) VALUES ($1, $2, $3,0) RETURNING *`,
            [thread, timestamp, id]
        );

        if (response.rowCount === 1) {
            return res.status(201).json({
                success: true,
                message: "Thread created successfully.",
                data: response.rows[0] // Return the inserted thread
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to create thread."
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.post('/comment/:tid/:id', async (req, res) => {
    try {
        console.log('Trying to post comment')
        const { id, tid } = req.params;
        console.log(req.body)
        const { comment } = req.body;

        // Assuming your database supports auto-generating timestamps,
        // otherwise, you can manually create the timestamp here.

        // Insert the comment into the comments table
        const response = await req.client.query(
            `INSERT INTO "comment" (description,likes, replies, user_id, thread_id, parent_id) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [comment,0, 0, id, tid, null]
        );

        if (response.rowCount === 1) {
            return res.status(201).json({
                success: true,
                message: "Comment created successfully.",
                data: response.rows[0] // Return the inserted comment
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to create comment."
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.get('/comment/:tid/:uid', async (req, res) => {
    try {
        const { tid,uid } = req.params;
        console.log('Trying to get comments')
        // Fetch comments associated with the given thread id
        const response = await req.client.query(
            `SELECT 
            c.comment_id,
            c.description,
            c.timestamp,
            c.likes,
            c.replies,
            c.media,
            c.user_id AS poster_id, -- Alias user_id as poster_id
            u.firstname,
            u.lastname,
            u.user_photo,
            c.parent_id,
            CASE WHEN cl.user_id IS NULL THEN false ELSE true END AS liked_by_user
        FROM 
            "comment" c 
        JOIN 
            users u ON u.user_id = c.user_id 
        LEFT JOIN 
            comment_likes cl ON cl.comment_id = c.comment_id AND cl.user_id = $2
        WHERE 
            c.thread_id = $1
        order by c.timestamp
        `,
            [tid, uid]
        );

        return res.status(200).json({
            success: true,
            message: "Comments fetched successfully.",
            data: response.rows // Return the fetched comments
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});



router.post('/comment/:tid/:parent_id/:uid', async (req, res) => {
    try {
        const { tid, parent_id, uid } = req.params;
        const { comment } = req.body;
        console.log(req.body)
        console.log(req.params)

        // Insert the reply into the comments table
        const response = await req.client.query(
            `INSERT INTO "comment" (thread_id, parent_id, user_id, description,likes,replies) VALUES ($1, $2, $3, $4,0,0) RETURNING *`,
            [tid, parent_id, uid, comment]
        );

        return res.status(201).json({
            success: true,
            message: "Reply posted successfully.",
            data: response.rows[0] // Return the inserted reply
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.put('/:tid/:uid', async (req, res) => {
    try {
        console.log('in liking')
        const { tid, uid } = req.params;
        console.log(req.body)
        console.log(req.params)
        await req.client.query(
            `INSERT INTO Log (id, user_id) VALUES ($1, $2)`,
            [9, uid]
        );

        // Call the stored procedure to handle the liking process
        const response = await req.client.query('CALL like_unlike_thread($1, $2)', [tid, uid]);

        // Insert into the log table
      

        return res.status(201).json({
            success: true,
            message: "Liked successfully.",
            data: response.rows[0] // Return the inserted reply
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});


router.put('/comment/:cid/:uid', async (req, res) => {
    try {
        console.log('in liking')
        const { cid, uid } = req.params;
        console.log(req.body)
        console.log(req.params)
        await req.client.query(
            `INSERT INTO Log (id, user_id) VALUES ($1, $2)`,
            [10, uid]
        );
        // Call the stored procedure to handle the liking process
        const response = await req.client.query('CALL like_unlike_comment($1, $2)', [cid, uid]);

        // Insert into the log table
        

        return res.status(201).json({
            success: true,
            message: "Liked successfully.",
            data: response.rows[0] // Return the inserted reply
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

module.exports = {
    middleware,
    router
};
