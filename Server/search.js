const express = require('express');
const router = express.Router();

// Middleware function to initialize the client
const middleware = (client) => {
    return (req, res, next) => {
        req.client = client;
        next();
    };
};





router.post('/:id', async (req, res) => {
    try {
        console.log('in search')
        console.log(req.params);

        // Destructure formData from request query
        const { cuisine, category, searchR, searchI, rating, halalharam } = req.body;
        console.log(req.body)

        // Construct the SQL query dynamically based on formData
        let sqlQuery = `
        SELECT fr.fr_id, fr.food_name, fr.rating, fr.halalharam
        FROM public.food_recipe AS fr
        LEFT JOIN public.food_categories AS fc ON fr.fr_id = fc.fr_id
        LEFT JOIN public.categories AS c ON fc.category_id = c.category_id
        LEFT JOIN public.food_cuisines AS fcu ON fr.fr_id = fcu.fr_id
        LEFT JOIN public.cuisines AS cu ON fcu.cuisine_id = cu.cuisine_id
        LEFT JOIN public.food_ingredients AS fi ON fr.fr_id = fi.fr_id
        LEFT JOIN public.ingredients AS ing ON fi.ingredient_id = ing.ingredient_id
        LEFT JOIN public.ingredient_categories AS ic ON ing.ic_id = ic.ic_id
        WHERE 1=1`;
    
        const params = [];
        
        // Check if formData fields are not empty and add conditions to the query
        if (searchR) {
            sqlQuery += ` AND fr.food_name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(searchR);
        }
        
        if (searchI) {
            sqlQuery += ` AND ic.category_name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(searchI);
        }
        
        if (rating) {
            sqlQuery += ` AND fr.rating >= $${params.length + 1}`;
            params.push(rating);
        }
        
        if (cuisine) {
            sqlQuery += ` AND cu.cuisine_name = $${params.length + 1}`;
            params.push(cuisine);
        }
        
        if (category) {
            sqlQuery += ` AND c.category_name = $${params.length + 1}`;
            params.push(category);
        }
        
        if (halalharam) {
            sqlQuery += ` AND fr.halalharam = LOWER($${params.length + 1})`;
            params.push(halalharam);
        }
        
        sqlQuery += ` GROUP BY fr.fr_id, fr.food_name, fr.rating, fr.halalharam
                    ORDER BY fr.rating DESC`;
        console.log(sqlQuery);
        

        // Execute the query with parameters
        const response = await req.client.query(sqlQuery, params);

        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
                data: response.rows
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No recipes found."
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



module.exports = {
    middleware,
    router
};