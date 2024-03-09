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

router.get('/:oid/:id', async (req, res) => {
    try {
        const { oid, id } = req.params;

        // Query to fetch user information
        const userResponse = await req.client.query(
            `SELECT * FROM users u LEFT JOIN location l ON u.location_id = l.location_id LEFT JOIN country c ON l.country_id = c.country_id WHERE u.user_id = $1`,
            [oid]
        );

        if (userResponse.rowCount !== 1) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Query to check if user with id follows user with oid
        const followResponse = await req.client.query(
            'SELECT COUNT(*) AS count FROM followers WHERE follower_id = $1 AND user_id = $2',
            [id, oid]
        );

        const isFollowing = followResponse.rows[0].count > 0;
        console.log(isFollowing)
        return res.status(200).json({
            success: true,
            data: userResponse.rows,
            isFollowing: isFollowing,
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});


router.get('/socialStanding/:oid/:id', async (req, res) => {
    try {
        const {oid,id} = req.params;
        const response = await req.client.query(
            `SELECT 
                (SELECT COUNT(*) FROM followers WHERE follower_id = $1) AS following,
                (SELECT COUNT(*) FROM followers WHERE user_id = $1) AS followers
             FROM users 
             WHERE user_id = $1`, [oid]
        );
        console.log(response.rows);
        if (response.rowCount == 1) {
            console.log(response.rowCount);
            return res.status(200).json({
                success: true,
                data: response.rows[0] // Assuming only one row will be returned
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false
        });
    }
});



router.put('/follow/:oid/:id', async (req, res) => {
    try {
        const { oid, id } = req.params;
        
        // Call the stored procedure to manage followers
        await req.client.query(
            `CALL manage_followers($1, $2)`, [oid, id]
        );
        
        // Insert into the log table
        await req.client.query(
            `INSERT INTO Log (id, user_id) VALUES ($1, $2)`, [11, id]
        );
        
        return res.status(200).json({
            success: true,
            message: 'Procedure executed successfully'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});





router.get('/food/:oid/:id', async (req, res) => {
    console.log('GET collection');
    try {
        const query = `
            SELECT fr.* 
            FROM food_recipe fr 
            JOIN user_saved_food usf ON (fr.fr_id = usf.fr_id) 
            WHERE usf.user_ID = $1
        `;
        const {oid,id} = req.params;
        const response = await req.client.query(query, [oid]);

        console.log(response.rows);
        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
                data: response.rows
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No recipes found for the specified user."
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});



module.exports = {
    middleware,
    router
};
