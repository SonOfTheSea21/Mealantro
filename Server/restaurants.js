const express = require('express');
const router = express.Router();

// Middleware function to initialize the client
const middleware = (client) => {
    return (req, res, next) => {
        req.client = client;
        next();
    };
};


router.get('/', async (req, res) => {
    try {
        console.log(req.params);
        const response = await req.client.query(
            `SELECT * FROM restaurants r join "location" l on r.location_id = l.location_id join country c on l.country_id = c.country_id order by r.restaurant_name asc;`,
        );

        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
                data: response.rows
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No restaurants found."
            });
        }
    } catch (err) {
        console.log(err);
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