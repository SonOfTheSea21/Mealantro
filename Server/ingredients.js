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
            `SELECT ic_id,category_name FROM ingredient_categories where tier <> 4 order by category_name asc`
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
            `SELECT ic_id,category_name FROM ingredient_categories where tier = 4`
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

router.get('/:id', async (req, res) => {
    try {
        console.log(req.params);
        const responseFoodByIngredient = await req.client.query(
            `select fr.food_name,fr.rating,fr.halalharam
            from food_recipe fr join food_ingredients fi on (fr.fr_id = fi.fr_id)
            JOIN ingredients i ON (fi.ingredient_id = i.ingredient_id)
            join ingredient_categories ic on (i.ic_id = ic.ic_id)
            where fr.fr_id = $1 `,[req.params.id]
        );

        if (responseFoodByIngredient.rowCount>0) {

            return res.status(200).json({
                success: true,
                responseFoodByIngredient: responseFoodByIngredient.rows,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false
        });
    }
});

router.get('/inventory/:id', async (req, res) => {
    try {
        console.log(req.params);
        const responseInventory = await req.client.query(
            `select i.user_id, i.ingredient_id, ing.category_name, i.amount, i.amount_type, i.expiration_date 
            from inventory i join ingredient_categories ing on i.ingredient_id = ing.ic_id 
            where i.user_id = $1`,[req.params.id]
            
        );

        if (responseInventory.rowCount>=0) {
            //console.log(responseInventory.rows);
            return res.status(200).json({
                success: true,
                data: responseInventory.rows,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false
        });
    }
});

router.get('/inventory/time/:id', async (req, res) => {
    try {
        console.log(req.params);
        const responseInventory = await req.client.query(
            `select i_time from time_inventory i where i.user_id = $1`,[req.params.id]
            
        );

        console.log(responseInventory.rows);

        if (responseInventory.rowCount>=0) {
            //console.log(responseInventory.rows);
            return res.status(200).json({
                success: true,
                data: responseInventory.rows,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false
        });
    }
});


router.get('/all/:id', async (req, res) => {
    try {
        const responseAll = await req.client.query(
            `SELECT * FROM ingredient_categories`
        );

        if (responseAll.rowCount > 0) {
            return res.status(200).json({
                success: true,
                data: responseAll.rows,
            });
        } else {
            // If no rows are returned, you might want to return an empty array with 200 OK
            // or consider if a different status code is more appropriate
            return res.status(200).json({
                success: true,
                message: "No categories found",
                data: [],
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching ingredient categories."
        });
    }
});

router.get('/types/:id', async (req, res) => {
    try {
        const responseAll = await req.client.query(
            `SELECT amount_name FROM amount_types`
        );

        if (responseAll.rowCount > 0) {
            return res.status(200).json({
                success: true,
                data: responseAll.rows,
            });
        } else {
            // If no rows are returned, you might want to return an empty array with 200 OK
            // or consider if a different status code is more appropriate
            return res.status(200).json({
                success: true,
                message: "No types found",
                data: [],
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching amount types."
        });
    }
});

router.delete('/inventory/clear/:id', async (req, res) => {
    try {
        const query = `
            DELETE FROM inventory
            WHERE user_id = $1
        `;
        // Execute the deletion query
        const response = await req.client.query(query, [req.params.id]);
        
        if (response.rowCount == 1) {
            // Confirm the item was deleted
            return res.status(200).json({
                success: true,
            });
        } else {
            // Handle the case where the item does not exist or was not deleted
            return res.status(404).json({
                success: false,
                message: "Item not found or already deleted",
            });
        }
    } catch (err) {
        console.error("Error deleting inventory item:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});


router.delete('/inventory/remove/:uid/:id', async (req, res) => {
    try {
        const query = `
            DELETE FROM inventory
            WHERE user_id = $1 AND ingredient_id = $2
        `;
        // Execute the deletion query
        const response = await req.client.query(query, [req.params.uid, req.params.id]);
        
        if (response.rowCount == 1) {
            // Confirm the item was deleted
            return res.status(200).json({
                success: true,
            });
        } else {
            // Handle the case where the item does not exist or was not deleted
            return res.status(404).json({
                success: false,
                message: "Item not found or already deleted",
            });
        }
    } catch (err) {
        console.error("Error deleting inventory item:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

router.post('/inventory/insert/:id', async (req, res) => {
    console.log('POST');
    console.log(req.params);
    try {
        const query = `
            INSERT INTO inventory (user_id, ingredient_id, amount, amount_type, expiration_date) VALUES($1, $2, $3, $4, $5)
        `;

        const data = req.body;


        console.log(req.params);
        const response = await req.client.query(
            query, [
                data.id,
                data.ingredientId,
                data.amount,
                data.amountType,
                data.expirationDate
            ]
        );
        

        console.log(response.rows);
        if (response.rowCount == 1) {
            console.log(response.rowCount);
            return res.status(200).json({
                success: true,
            });
        }
    } catch (err) {
        console.error("Error updating inventory:", err);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.put('/inventory/update_time/:id', async (req, res) => {
    console.log('PUT');
    console.log(req.params);
    try {
        const query = `
            UPDATE time_inventory
            SET
                i_time = $2
            WHERE user_id = $1
        `;

        const data = req.body;


        console.log(req.params);
        const response = await req.client.query(
            query, [
                req.params.id,
                data.time
            ]
        );
        

        console.log(response.rows);
        if (response.rowCount == 1) {
            console.log(response.rowCount);
            return res.status(200).json({
                success: true,
            });
        }
    } catch (err) {
        console.error("Error updating inventory:", err);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


router.put('/inventory/update_amount/:uid/:id', async (req, res) => {
    console.log('PUT');
    console.log(req.params);
    try {
        const query = `
            UPDATE inventory
            SET
                amount = $3
            WHERE user_id = $1 AND ingredient_id = $2
        `;

        const data = req.body;


        console.log(req.params);
        const response = await req.client.query(
            query, [
                req.params.uid,
                req.params.id,
                data.amount
            ]
        );
        

        console.log(response.rows);
        if (response.rowCount == 1) {
            console.log(response.rowCount);
            return res.status(200).json({
                success: true,
            });
        }
    } catch (err) {
        console.error("Error updating inventory:", err);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.put('/inventory/update_amount_type/:uid/:id', async (req, res) => {
    console.log('PUT');
    console.log(req.params);
    try {
        const query = `
            UPDATE inventory
            SET
                amount_type = $3
            WHERE user_id = $1 AND ingredient_id = $2
        `;

        const data = req.body;


        console.log(req.params);
        const response = await req.client.query(
            query, [
                req.params.uid,
                req.params.id,
                data.amountType
            ]
        );
        

        console.log(response.rows);
        if (response.rowCount == 1) {
            console.log(response.rowCount);
            return res.status(200).json({
                success: true,
            });
        }
    } catch (err) {
        console.error("Error updating inventory:", err);

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