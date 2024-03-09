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
    try {/*
        const responseCategory = await req.client.query(
            `SELECT tcat_name FROM tip_category`
        );
        const responseTips = await req.client.query(
            `SELECT title,description FROM kitchen_tips`
        );
        //console.log(response.rows);
        if (responseCategory.rowCount >0 && responseTips.rowCount>0) {
            //console.log(response.rowCount);

            return res.status(200).json({
                success: true,
                responseCategory: responseCategory.rows,
                responseTips: responseTips.rows
            });
        }*/
        const response = await req.client.query(
            `SELECT (SELECT tcat_name FROM tip_category tc WHERE tc.tcat_id = kt.tcat_id) category, title, description FROM kitchen_tips kt ORDER BY category`
        );
        console.log(response.rows);
        if (response.rowCount >0) {
            console.log(response.rowCount);

            return res.status(200).json({
                success: true,
                data: response.rows
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false
        });
    }
});

router.get('/dropdown', async (req, res) => {
    try {
     
        const response = await req.client.query(
            `SELECT tcat_id,tcat_name from tip_category ORDER BY tcat_id`
        );
        console.log(response.rows);
        if (response.rowCount >0) {
            console.log(response.rowCount);

            return res.status(200).json({
                success: true,
                data: response.rows
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false
        });
    }
});

router.get('/:idT', async (req, res) => {
    try {
        console.log(req.params);
        const responseCategory = await req.client.query(
            `SELECT tcat_name FROM tip_category where tcat_id = $1`,[req.params.idT]
        );
        const responseTips = await req.client.query(
            `SELECT title,description FROM kitchen_tips where tcat_id = $1`, [req.params.idT]
        );

        if (responseCategory.rowCount >0 && responseTips.rowCount>0) {

            return res.status(200).json({
                success: true,
                responseCategory: responseCategory.rows,
                responseTips: responseTips.rows
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false
        });
    }
});

router.get('/:idT/:idK', async (req, res) => {
    try {
        console.log(req.params);
        const responseCategory = await req.client.query(
            `SELECT tcat_name FROM tip_category where tcat_id = $1`,[req.params.idT]
        );
        const responseTips = await req.client.query(
            `SELECT title,description FROM kitchen_tips where tip_id = $1`, [req.params.idK]
        );

        if (responseCategory.rowCount >0 && responseTips.rowCount>0) {

            return res.status(200).json({
                success: true,
                responseCategory: responseCategory.rows,
                responseTips: responseTips.rows
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false
        });
    }
});





module.exports = {
    middleware,
    router
};