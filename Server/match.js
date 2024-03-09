
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
        console.log(req.params);
        const id = req.params;
        const response = await req.client.query(
            `select (SELECT food_name FROM food_recipe fr WHERE fr.fr_id = fi.fr_id) food_name,
            round(sum(case
                when i.amount >= fi.amount then 1
                when i.ingredient_id is not null then i.amount / fi.amount
                else 0
            end
            ) / cast(count(fi.ingredient_id) as decimal) * 100, 2) as Matching_pct
            from food_ingredients fi 
            left join inventory i
            on fi.ingredient_id = i.ingredient_id and i.user_id = $1
            group by fi.fr_id, food_name
            order by fi.fr_id`, [id.id]
        );
        console.log(response.rows);
        if (response.rowCount == 1) {
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



module.exports = {
    middleware,
    router
};
