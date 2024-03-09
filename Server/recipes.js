const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });


// Middleware function to initialize the client
const middleware = (client) => {
    return (req, res, next) => {
        req.client = client;
        next();
    };
};

const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Mealantro2',
    password: 'Raiyan2411',
    port: 5432,
});



router.get('/', async (req, res) => {
    try {
        console.log(req.params);
        const response = await req.client.query(
            `SELECT * FROM "food_recipe" order by rating desc`,
        );

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
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.get('/mostViewed/:id', async (req, res) => {
    try {
        console.log(req.params);
        const response = await req.client.query(
            `SELECT *
            FROM food_recipe
            ORDER BY times_visited DESC
            LIMIT 5;`,
        );

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
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.get('/preferred_cuisine/:id', async (req, res) => {
    try {
        console.log(req.params);
        const response = await req.client.query(
            `SELECT *
            FROM food_recipe fr join food_cuisines fc on fr.fr_id = fc.fr_id
            join cuisines c on fc.cuisine_id = c.cuisine_id
            join user_preferred_cuisines uc on c.cuisine_id = uc.cuisine_id
            WHERE uc.user_id = $1;`, [req.params.id]
        );

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
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});


router.get('/nearbyRestaurants/:id', async (req, res) => {
    try {
        console.log(req.params);
        const response = await req.client.query(
            `SELECT Food_recipe.*
            FROM Food_recipe
            WHERE EXISTS (
              SELECT 1
              FROM Restaurants
              JOIN Restaurant_Food ON Restaurants.Restaurant_ID = Restaurant_Food.restaurant_id
              WHERE Restaurant_Food.fr_id = Food_recipe.FR_ID
                AND CheckDishAvailabilityNearUser($1, Food_recipe.FR_ID) = 1
            );`, [req.params.id]
        );

        await req.client.query(
            `INSERT INTO Log (id, user_id) VALUES (12, $1)`, [req.params.id]
        );

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
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.get('/logs/:id', async (req, res) => {
    try {
        console.log(req.params);
        const response = await req.client.query(
            `SELECT * FROM Log l join plsql p on l.id = p.id`
        );

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
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.get('/byrestaurant/:sId', async (req, res) => {
    try {
        console.log('hello')
        const restId = req.params.sId;
        console.log(restId);
        console.log(`caught`)
        const response = await req.client.query(
            `SELECT fr.* 
            FROM food_recipe fr JOIN restaurant_food rf
            ON fr.fr_id =rf.fr_id 
            WHERE rf.restaurant_id = $1`, [restId]);
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
        res.status(500).send('Internal server error');
    }
});


router.get('/users/:id', async (req, res) => {
    try {
        console.log('hello')
        
        const response = await req.client.query(
            `SELECT * 
            FROM food_recipe fr 
            WHERE user_id = $1`, [req.params.id]);
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
        res.status(500).send('Internal server error');
    }
});


router.post('/submitreport', async (req, res) => {
    try {
        console.log('hello')

        const {
            reportText, recipeId, userId
          } = req.body;

          console.log(req.body);
        
        const response = await req.client.query(
            `INSERT INTO reports (complainer_id, recipe_id, description, status) VALUES 
            ($1, $2, $3, 0)`, [userId, recipeId, reportText]);
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
        res.status(500).send('Internal server error');
    }
});

router.get('/reports', async (req, res) => {
    try {
        console.log('hello')

        

          console.log(req.body);
        
          const response = await req.client.query(
            `SELECT *
            FROM reports r join food_recipe fr on r.recipe_id = fr.fr_id;`);
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
        res.status(500).send('Internal server error');
    }
});

router.get('/reports/unseen', async (req, res) => {
    try {
        console.log('hello')

        

          console.log(req.body);
        
          const response = await req.client.query(
            `SELECT *
            FROM reports
            WHERE status = 0;`);
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
        res.status(500).send('Internal server error');
    }
});

router.put('/reports/update/:rId', async (req, res) => {
    try {
        console.log('hello')

        

          console.log(req.body);
        
          const response = await req.client.query(
            `UPDATE reports
            SET status = 1
            WHERE report_id = $1;`, [req.params.rId]);
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
        res.status(500).send('Internal server error');
    }
});


router.get('/:recipeId', async (req, res) => {

    try {
        console.log(req.params);
        const recipeId = req.params.recipeId;
        
        await req.client.query('BEGIN'); // Start transaction

        // Increment timesvisited by 1 for the specified recipeId
        const updateQuery = `UPDATE food_recipe SET times_visited = times_visited + 1 WHERE fr_id = $1`;
        await req.client.query(updateQuery, [recipeId]);

        // Your existing SELECT statement, adjusted for fetching the recipe details
        const selectQuery = `SELECT * FROM food_recipe f LEFT JOIN food_cuisines fc ON f.fr_id = fc.fr_id LEFT JOIN cuisines c ON fc.cuisine_id = c.cuisine_id WHERE f.fr_id = $1`;
        const response = await req.client.query(selectQuery, [recipeId]);

        await req.client.query('COMMIT'); // Commit transaction if both queries run successfully

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
        await client.query('ROLLBACK'); // Roll back transaction on error
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.get('/ingredients/:recipeId', async (req, res) => {
    try {
        console.log(req.params);
        const recipeId = req.params.recipeId;
        const response = await req.client.query(
            `SELECT * FROM food_ingredients fi LEFT JOIN ingredients i ON fi.ingredient_id = i.ingredient_id WHERE fi.fr_id = $1`, [recipeId],
        );

        if (response.rowCount >= 0) {
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
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});


router.get('/byinventory/:id', async (req, res) => {
    try {
        console.log(req.params);
        const userId = req.params.id;
        const response = await req.client.query(
            `SELECT fr.*, return_percentage($1, fr.fr_id) AS "percent" FROM food_recipe fr ORDER BY "percent" DESC`, [userId]
        );

        // Insert into the log table
       await req.client.query(
            `INSERT INTO Log (id, user_id) VALUES (3, $1)`, [userId]
        );


        

      
        


        if (response.rowCount >= 0) {
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
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});


router.get('/categories/:recipeId', async (req, res) => {
    try {
        console.log(req.params);
        const recipeId = req.params.recipeId;
        const response = await req.client.query(
            `SELECT * FROM food_categories fc LEFT JOIN categories c ON fc.category_id = c.category_id WHERE fc.fr_id = $1`, [recipeId],
        );

        if (response.rowCount >= 0) {
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
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.delete('/delete/:rid', async (req, res) => {
    try {
        const query = `
            DELETE FROM food_recipe
            WHERE fr_id = $1
        `;
        // Execute the deletion query
        const response = await req.client.query(query, [req.params.rid]);
        
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
        console.error("Error deleting recipe:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

router.get('/conditions/all', async (req, res) => {
    try {
        console.log(req.params);
        const recipeId = req.params.recipeId;
        const response = await req.client.query(
            `SELECT * FROM conditions`, [],
        );

        if (response.rowCount >= 0) {
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
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

router.get('/conditions/:recipeId', async (req, res) => {
    try {
        console.log(req.params);
        const recipeId = req.params.recipeId;
        const response = await req.client.query(
            `SELECT * FROM food_conditions fc LEFT JOIN conditions c ON fc.condition_id = c.condition_id WHERE fc.fr_id = $1`, [recipeId],
        );

        if (response.rowCount >= 0) {
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
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});


router.get('/image/:recipeId', async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const response = await req.client.query('SELECT food_photo FROM food_recipe WHERE fr_id = $1', [recipeId]);

        if (response.rowCount > 0) {
            const image = response.rows[0].food_photo;
            res.writeHead(200, {
                'Content-Type': 'image/jpeg', // Change to the correct content type for your image
                'Content-Length': image.length
            });
            res.end(image);
        } else {
            res.status(404).send('Image not found');
            console.log("Image not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

router.get('/bycuisine/:sId', async (req, res) => {
    try {
        console.log('hello')
        const cuisineId = req.params.sId;
        console.log(cuisineId);
        console.log(`caught`)
        const response = await req.client.query(
            `SELECT fr.* 
            FROM food_recipe fr JOIN food_cuisines fc 
            ON fr.fr_id =fc.fr_id 
            JOIN cuisines c 
            ON fc.cuisine_id = c.cuisine_id
            WHERE c.cuisine_id = $1`, [cuisineId]);
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
        res.status(500).send('Internal server error');
    }
});

router.get('/bymeal/:sId', async (req, res) => {
    try {
        
        const mealId = req.params.sId;
        const response = await req.client.query(
            `SELECT fr.* 
            FROM food_recipe fr JOIN food_categories fc 
            ON fr.fr_id =fc.fr_id 
            JOIN categories c 
            ON fc.category_id = c.category_id
            WHERE c.category_id = $1`, [mealId]);
            console.log(response.rows)
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
        res.status(500).send('Internal server error');
    }
});

router.post('/insert/:id', upload.single('foodphoto'), async (req, res) => {
    try {
      const userId = req.params.id;
      const {
        recipename, cuisine, isHalal, preptime, cooktime, servings, directions,
        addedIngredients, selectedConditions, selectedCategories, foodphoto
      } = req.body;

      console.log(req.body);

      const file = req.file;
  
      const client = await pool.connect();
  
      // Start a transaction
      await req.client.query(
        `INSERT INTO Log (id, user_id) VALUES (5, $1)`, [userId]
        );
      await client.query('BEGIN');
      
      // Insert recipe and retrieve FR_ID
      const insertRecipeQuery = `
        INSERT INTO Food_recipe (Food_Name, HalalHaram, Preparation_Time, Cooking_Time, Servings, Directions, User_ID)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING FR_ID;
      `;
      const recipeResponse = await client.query(insertRecipeQuery, [
        recipename,
        isHalal === 'true' ? 'Halal' : 'Haram', // Assuming halalHaram is a boolean in your form data
        preptime,
        cooktime,
        servings,
        directions,
        userId, 
      ]);
      const frId = recipeResponse.rows[0].fr_id;

      console.log(foodphoto);

      if (file) {

        const filePath = file.path; // The path to the uploaded file

        // Read the file into a buffer
        const fileBuffer = fs.readFileSync(filePath);

        
        const insertPhotoQuery = `
            UPDATE Food_recipe
            SET Food_Photo = $1
            WHERE FR_ID = $2;
        `;
        await client.query(insertPhotoQuery, [fileBuffer, frId]);
        }
        else
        {
            const insertPhotoQuery = `
            UPDATE Food_recipe
            SET Food_Photo = $1
            WHERE FR_ID = $2;
        `;
        await client.query(insertPhotoQuery, [foodphoto, frId]);
        }



      const insertCuisineQuery = `
  INSERT INTO Food_Cuisines (cuisine_id, fr_id)
  VALUES ($1, $2);
`;

await client.query(insertCuisineQuery, [
  cuisine, // Assuming this is the ID of the selected cuisine from your form
  frId,
]);

  
      // Handle categories and conditions
      const insertCategoriesAndConditions = async () => {
        const categories = JSON.parse(selectedCategories);
        const conditions = JSON.parse(selectedConditions);

        console.log(categories);
        console.log(conditions);
  
        // Insert categories
        const categoryInsertQuery = 'INSERT INTO Food_Categories (category_id, fr_id) VALUES ($1, $2);';
        for (let category of categories) {
          await client.query(categoryInsertQuery, [category.category_id, frId]);
        }
  
        // Insert conditions
        const conditionInsertQuery = 'INSERT INTO Food_conditions (condition_id, fr_id) VALUES ($1, $2);';
        for (let condition of conditions) {
          await client.query(conditionInsertQuery, [condition.condition_id, frId]);
        }
      };
  
      await insertCategoriesAndConditions();

      const addIng = JSON.parse(addedIngredients);

      console.log("marhaba", addIng);
  
      // Handle ingredients
      const insertIngredients = async () => {
        for (let ingredient of addIng) {

            console.log("marhaba", ingredient);
          // Check if ingredient already exists
          const checkIngredientQuery = `
            SELECT Ingredient_ID FROM Ingredients
            WHERE Ingredient_Name = $1 AND IC_ID = $2 AND Density = $3;
          `;
          const checkRes = await client.query(checkIngredientQuery, [
            ingredient.ingredient_name,
            ingredient.ic_id,
            ingredient.density,
          ]);
      
          let ingredientId;

          const getMaxIdQuery = 'SELECT MAX(Ingredient_ID) as max_id FROM Ingredients';
            const maxIdRes = await client.query(getMaxIdQuery);
            const nextId = maxIdRes.rows[0].max_id + 1;
      
          if (checkRes.rowCount === 0) {
            // Ingredient does not exist, insert new ingredient
            const insertIngredientQuery = `
              INSERT INTO Ingredients (Ingredient_ID, Ingredient_Name, IC_ID, Density)
              VALUES ($4, $1, $2, $3) RETURNING Ingredient_ID;
            `;
            const insertRes = await client.query(insertIngredientQuery, [
              ingredient.ingredient_name,
              ingredient.ic_id,
              ingredient.density,
                nextId,
            ]);
            ingredientId = insertRes.rows[0].ingredient_id;
          } else {
            // Ingredient exists, use the existing ID
            ingredientId = checkRes.rows[0].ingredient_id;
          }
      
          // Insert into Food_ingredients
          const insertFoodIngredientQuery = `
            INSERT INTO Food_ingredients (fr_id, ingredient_id, Amount_type, Amount)
            VALUES ($1, $2, $3, $4);
          `;
          await client.query(insertFoodIngredientQuery, [
            frId, // Make sure frId is available from the inserted recipe
            ingredientId,
            ingredient.amount_type,
            ingredient.amount,
          ]);
        }
      };
      
      await insertIngredients();
  
      // Commit transaction
      await client.query('COMMIT');
  
      client.release();
      res.status(200).json({ success: true, message: 'Recipe inserted successfully', frId: frId });
    } catch (error) {
      console.error('Failed to insert recipe:', error);
      await client.query('ROLLBACK');
      client.release();
      res.status(500).json({ success: false, error: error.message });
    }
  });

router.get('/byingredient/:sId', async (req, res) => {
    try {
        const mealId = req.params.sId;
        const response = await req.client.query(
            `SELECT fr.*, ic.category_name, 
            parent1.category_name AS parent_category_name_1,
            parent2.category_name AS parent_category_name_2,
            parent3.category_name AS parent_category_name_3
            FROM food_recipe fr 
            JOIN food_ingredients fi ON fr.fr_id = fi.fr_id
            JOIN ingredients i ON i.ingredient_id = fi.ingredient_id
            JOIN ingredient_categories ic ON ic.ic_id = i.ic_id
            LEFT JOIN ingredient_categories parent1 ON ic.parent_id = parent1.ic_id
            LEFT JOIN ingredient_categories parent2 ON parent1.parent_id = parent2.ic_id
            LEFT JOIN ingredient_categories parent3 ON parent2.parent_id = parent3.ic_id
            WHERE ic.ic_id = $1
                OR parent1.ic_id = $1
                OR parent2.ic_id = $1
                OR parent3.ic_id = $1;
     `, [mealId]);

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
        res.status(500).send('Internal server error');
    }
});


module.exports = {
    middleware,
    router
};