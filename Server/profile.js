// account.js
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
    database: 'MEALANTRO',
    password: 'Ilovemself@139',
    port: 5432,
});

router.get('/:id', async (req, res) => {
    try {
        console.log(req.params);
        const id = req.params.id;
        const response = await req.client.query(
            `SELECT * FROM users u left JOIN LOCATION l ON u.location_id = l.location_id left JOIN country c ON l.country_id = c.country_id WHERE u.user_id = $1`, [id]
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

router.get('/image/:id', async (req, res) => {
    try {
        console.log(req.params);
        const id = req.params.id;
        const response = await req.client.query(
            `SELECT user_photo FROM users u WHERE u.user_id = $1`, [id]
        );
        console.log(response.rows);
        if (response.rowCount > 0) {
            const image = response.rows[0].user_photo;
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
        console.log(err);
        return res.status(403).json({
            success: false
        });
    }
});

router.get('/foodrating/:id/:rid', async (req, res) => {
    try {
        console.log(req.params);
        const id = req.params.id;
        const rid = req.params.rid;
        const response = await req.client.query(
            `SELECT rating FROM user_rating_food u WHERE u.user_id = $1 AND u.fr_id = $2`, [id, rid]
        );
        console.log(response.rows);
        if (response.rowCount > 0) {
            // Rating exists, return the rating
            return res.status(200).json({
                success: true,
                rating: response.rows[0].rating
            });
        } else {
            // No rating found
            return res.status(200).json({
                success: true,
                rating: null // Indicate no rating was found
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false
        });
    }
});




router.get('/socialStanding/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const response = await req.client.query(
            `SELECT 
                (SELECT COUNT(*) FROM followers WHERE follower_id = $1) AS followers,
                (SELECT COUNT(*) FROM followers WHERE user_id = $1) AS following
             FROM users 
             WHERE user_id = $1`, [id]
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


router.get('/beforeChange/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const response = await req.client.query(
            `SELECT firstname,lastname,email,user_photo FROM users where user_id= $1`, [id]
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

router.put('/update/:id', upload.single('user_photo'), async (req, res) => {
    console.log('PUT');
    try {
        const query1 = `
        CALL update_user_and_location($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
        `;

        const query2 = `UPDATE users SET user_photo = $1 WHERE user_id = $2`;


        const data = req.body;
        const file = req.file;

        console.log(req.params);
        const id = req.params;

        if (file) {
            const filePath = file.path; // The path to the uploaded file

        // Read the file into a buffer
        const fileBuffer = fs.readFileSync(filePath);

        console.log("Type of fileBuffer:", typeof fileBuffer); // Should log "object"
console.log("fileBuffer is an instance of Buffer:", fileBuffer instanceof Buffer); // Should log "true"

        

        pool.query(query2, [fileBuffer, id.id])
  .then(res => console.log('Insert success'))
  .catch(err => console.error('Insert error:', err));

        fs.unlinkSync(filePath);

        };
await req.client.query(
            `INSERT INTO Log (id, user_id) VALUES (1, $1)`, [id.id]
        );


        const response = await req.client.query(
            query1, [
                id.id,
                data['firstname'],
                data['lastname'],
                data['email'],
                data['birthdate'],
                data['nationality'],
                data['occupation'],
                data['religion'],
                data['street_name'],
                data['postal_code'],
                data['city'],
                data['country_name']
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
        console.error("Error updating profile:", err);

        // Optionally, delete the temporary file in case of an error as well
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.put('/update/change-password/:id', async (req, res) => {
    console.log('PUT');
    try {
        // Insert into the log table
        const id = req.params;
        await req.client.query(
            `INSERT INTO Log (id, user_id) VALUES (4, $1)`, [id.id]
        );

        const query = `
            UPDATE users
            SET
                password = crypt($1, (SELECT password FROM users WHERE user_id = $2))
            WHERE
                user_id = $3
        `;
        const data = req.body;

        console.log(req.params);
        const response = await req.client.query(
            query, [
                data.password,
                id.id,
                id.id
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
        console.log(err)
        if (err.message.includes('last update')) {
            return res.status(401).json({
                success: false,
                message: "Password cannot be updated within 2 days of the last update."
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "New password cannot be the same as the old password."
            });
        }
    }
});


router.post('/insertfoodrating/:id/:rid', async (req, res) => {
    console.log('POST');
    try {
        const id = req.params;
        await req.client.query(
            `INSERT INTO Log (id, user_id) VALUES (6, $1)`, [id.id]
        );
        const query = `
            INSERT INTO user_rating_food
            (user_id, fr_id, rating)
            VALUES
            ($1, $2, $3)
        `;
        const data = req.body;

        console.log(req.params);
        
        const response = await req.client.query(
            query, [
                id.id,
                id.rid,
                data.rating
            ]
        );

        console.log(response.rows);
        if (response.rowCount == 1) {
            console.log(response.rowCount);

            // Insert into the log table

            return res.status(200).json({
                success: true,
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.put('/updatefoodrating/:id/:rid', async (req, res) => {
    console.log('PUT');
    try {
          // Insert into the log table
        const data = req.body;

        console.log(req.params);
        const id = req.params;
         await req.client.query(
            `INSERT INTO Log (id, user_id) VALUES (6, $1)`, [id.id]
        );
        const query = `
            UPDATE user_rating_food
            SET
                rating = $3
            WHERE
                user_id = $1 AND fr_id = $2
        `;
       

        
        const response = await req.client.query(
            query, [
                id.id,
                id.rid,
                data.rating
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
        console.log(err)
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


router.get('/checkSavedRecipe/:id/:rid', async (req, res) => {
    const { id, rid } = req.params;

    try {
        // Query to check if the user has saved this recipe
        const query = `
            SELECT * FROM user_saved_food
            WHERE user_id = $1 AND fr_id = $2
        `;
        const { rows } = await pool.query(query, [id, rid]);

        // If rows.length > 0, it means the recipe is saved by the user
        const isSaved = rows.length > 0;
        
        res.json({ isSaved }); // Send the boolean value as response
    } catch (error) {
        console.error('Error checking saved status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/insertSavedRecipe/:userId/:recipeId', async (req, res) => {
    const { userId, recipeId } = req.params;

    try {
        const insertQuery = `
            INSERT INTO user_saved_food (user_id, fr_id)
            VALUES ($1, $2)
        `;
        await pool.query(insertQuery, [userId, recipeId]);
        res.status(200).json({ success: true, message: 'Recipe saved successfully.' });
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.delete('/deleteSavedRecipe/:userId/:recipeId', async (req, res) => {
    const { userId, recipeId } = req.params;

    try {
        const deleteQuery = `
            DELETE FROM user_saved_food
            WHERE user_id = $1 AND fr_id = $2
        `;
        await pool.query(deleteQuery, [userId, recipeId]);
        res.status(200).json({ success: true, message: 'Recipe unsaved successfully.' });
    } catch (error) {
        console.error('Error deleting saved recipe:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



router.get('/food/:id', async (req, res) => {
    console.log('GET collection');
    try {
        const query = `
            SELECT fr.* 
            FROM food_recipe fr 
            JOIN user_saved_food usf ON (fr.fr_id = usf.fr_id) 
            WHERE usf.user_ID = $1
        `;
        const id = req.params.id;
        const response = await req.client.query(query, [id]);

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

router.delete('/savedFood/delete/:id/:idF', async (req, res) => {
    console.log('GET collection');
    try {
        const query = `
            Delete 
            from user_saved_food 
            WHERE user_ID = $1 and fr_id = $2
        `;
        const id = req.params.id;
        const fr_id = req.params.idF
        const response = await req.client.query(query, [id,fr_id]);
        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
           
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No saved recipes found for the specified user."
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

router.get('/userFood/:id', async (req, res) => {
    console.log('GET collection');
    try {
        const query = `
            SELECT * 
            FROM food_recipe 
            WHERE user_ID = $1
        `;
        const id = req.params.id;
        const response = await req.client.query(query, [id]);

        console.log(response.rows);
        const data1 = {output : response.rows}
        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
                data: data1
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
