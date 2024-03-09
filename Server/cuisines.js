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
        const response = await req.client.query(
            `SELECT * FROM cuisines order by cuisine_name`
        );
        //console.log(response.rows);
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
            `SELECT * FROM cuisines order by cuisine_name`
        );
        //console.log(response.rows);
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

router.get('/:id', async (req, res) => {
    try {
        console.log(req.params);
        const responseCuisine = await req.client.query(
            `SELECT * FROM cuisines where cuisine_id = $1 `,[req.params.id]
        );
        const responseCuisineFood = await req.client.query(
            `select fr.food_name,rating,halalharam
            from food_cuisines fc join food_recipe fr on (fc.fr_id = fr.fr_id)
            where fc.cuisine_id = $1 
            order by fr.food_name`,[req.params.id]
        );

        if (responseCuisine.rowCount >0 && responseCuisineFood.rowCount>0) {

            return res.status(200).json({
                success: true,
                responseCuisine: responseCuisine.rows,
                responseCuisineFood: responseCuisineFood.rows
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