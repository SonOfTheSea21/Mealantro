const express = require('express');
const app = express();
const cors = require('cors');
const { Client } = require('pg');
const client = require('./db');

app.use(express.json());
app.use(cors());


//setting up routers
app.use('/oprofile', require('./oprofile').middleware(client)); // Use the middleware
//setting up routers
app.use('/oprofile', require('./oprofile').router); // Use the router//setting up routers
app.use('/profile', require('./profile').middleware(client)); // Use the middleware
app.use('/profile', require('./profile').router); // Use the router
app.use('/cuisines', require('./cuisines').middleware(client)); // Use the middleware
app.use('/cuisines', require('./cuisines').router); // Use the router
app.use('/ingredients', require('./ingredients').middleware(client)); // Use the middleware
app.use('/ingredients', require('./ingredients').router); // Use the router
app.use('/restaurants', require('./restaurants').middleware(client)); // Use the middleware
app.use('/restaurants', require('./restaurants').router); // Use the router
app.use('/kitchen-tips', require('./kitchen-tips').middleware(client)); // Use the middleware
app.use('/kitchen-tips', require('./kitchen-tips').router); // Use the router
app.use('/match', require('./match').middleware(client)); // Use the middleware
app.use('/match', require('./match').router); // Use the router

app.use('/recipes', require('./recipes').middleware(client)); // Use the middleware
app.use('/recipes', require('./recipes').router);

app.use('/meals', require('./meals').middleware(client)); // Use the middleware
app.use('/meals', require('./meals').router);

app.use('/search', require('./search').middleware(client)); // Use the middleware
app.use('/search', require('./search').router);

app.use('/newsfeed', require('./newsfeed').middleware(client)); // Use the middleware
app.use('/newsfeed', require('./newsfeed').router);


app.post('/SignUp', async (req, res) => {
  try {
      const data = req.body;

      // Call the stored procedure to register the user
      await client.query(
          `CALL register_user($1, $2, $3, $4, $5)`,
          [
              data['First Name'],
              data['Last Name'],
              data['email'],
              data['Password'],
              data['birthdate']
          ]
      );

      // Fetch the user_id of the registered user from the Users table using the email
      const userQuery = await client.query(
          `SELECT User_ID FROM Users WHERE Email = $1`,
          [data['email']]
      );

      // Extract the user_id from the query result
      const userId = userQuery.rows[0].user_id;

      // Insert into the log table
      await client.query(
          `INSERT INTO Log (id, user_id) VALUES ($1, $2)`,
          [7, userId]
      );

      return res.status(201).json({
          success: true,
          message: "User registered successfully."
      });
  } catch (err) {
      console.error(err);
      // Handle the error from the stored procedure
      if (err.message.includes('A user is already registered with this email')) {
          return res.status(409).json({
              success: false,
              message: "A user is already registered with this email."
          });
      } else {
          return res.status(500).json({
              success: false,
              message: "Internal server error."
          });
      }
  }
});

app.post('/Login', async (req, res) => {
  try {
      const data = req.body;

      const response2 = await client.query(
        `SELECT * FROM users WHERE email = $1`,
        [data['email']]
    );
    await client.query(
      `INSERT INTO Log (id, user_id) VALUES ($1, $2)`,
      [8, response2.rows[0].user_id]
  );

      // Call the stored procedure to verify login
      const response = await client.query(
          `CALL verify_login($1, $2)`,
          [data['email'], data['password']]
      );
      
      console.log(response2.rows[0])
      // Insert into the log table
    
      // Return success message if login is verified
      return res.status(200).json({
          success: true,
          data: response2.rows
      });
  } catch (err) {
      console.log(err)
      if (err.message.includes('User with email')) {
          return res.status(401).json({
              success: false,
              message: "Not Registered."
          });
      } else {
          return res.status(500).json({
              success: false,
              message: "Incorrect Password."
          });
      }
  }
});

// Endpoint to handle recipe search
app.get('/search/recipes', async (req, res) => {
    try {
      // Extract the search query from the URL query string
      const { q: query } = req.query;
      console.log(query);
  
      // Construct the SQL query to search for recipes containing the query
      const searchQuery = `
        SELECT * FROM food_recipe
        WHERE LOWER(food_name) LIKE LOWER('%${query}%')
      `;
  
      // Execute the SQL query
      const result = await client.query(searchQuery);
  
      // Return the search results to the client
      res.status(200).json({
        success: true,
        message: 'Recipes found successfully.',
        recipes: result.rows,
      });
    } catch (error) {
      console.error('Error searching recipes:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  });
  

  app.get('/search/ingredient', async (req, res) => {
    try {
      // Extract the search query from the URL query string
      const { q: query } = req.query;
      console.log(query);
  
      // Construct the SQL query to search for recipes containing the query
      const searchQuery = `
      SELECT ic_id,category_name FROM ingredient_categories WHERE LOWER(category_name) LIKE LOWER('%${query}%') order by category_name asc
      `;
  
      // Execute the SQL query
      const result = await client.query(searchQuery);
  
      // Return the search results to the client
      res.status(200).json({
        success: true,
        message: 'Ingredients found successfully.',
        recipes: result.rows,
      });
    } catch (error) {
      console.error('Error searching ingredients:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  });
// Route for searching categories
app.get('/search/meal', async (req, res) => {
    try {
      // Extract the search query from the URL query string
      const { q: query } = req.query;
      console.log(query);
  
      // Construct the SQL query to search for categories containing the query
      const searchQuery = `
        SELECT category_id, category_name,description
        FROM categories
        WHERE LOWER(category_name) LIKE LOWER('%${query}%')
        ORDER BY category_name ASC
      `;
  
      // Execute the SQL query
      const result = await client.query(searchQuery);
  
      // Return the search results to the client
      res.status(200).json({
        success: true,
        message: 'Meals found successfully.',
        recipes: result.rows,
      });
    } catch (error) {
      console.error('Error searching meals:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  });
  
  // Route for searching meals
  app.get('/search/cuisine', async (req, res) => {
    try {
      // Extract the search query from the URL query string
      const { q: query } = req.query;
      console.log(query);
  
      // Construct the SQL query to search for meals containing the query
      const searchQuery = `
        SELECT cuisine_id, cuisine_name, origin,description,spice_level,photo
        FROM cuisines
        WHERE LOWER(cuisine_name) LIKE LOWER('%${query}%')
        ORDER BY cuisine_name ASC
      `;
  
      // Execute the SQL query
      const result = await client.query(searchQuery);
  
      // Return the search results to the client
      res.status(200).json({
        success: true,
        message: 'Cuisines found successfully.',
        recipes: result.rows,
      });
    } catch (error) {
      console.error('Error searching cuisines:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  });
  app.get('/search/user', async (req, res) => {
    try {
      // Extract the search query from the URL query string
      const { q: query } = req.query;
      console.log(query);
  
      // Construct the SQL query to search for users containing the query in either firstname or lastname
      const searchQuery = `
        SELECT user_id, CONCAT(firstname, ' ', lastname) AS fullname, user_photo
        FROM users
        WHERE LOWER(CONCAT(firstname, ' ', lastname)) LIKE LOWER('%${query}%')
        ORDER BY fullname ASC
      `;
  
      // Execute the SQL query
      const result = await client.query(searchQuery);
  
      // Return the search results to the client
      res.status(200).json({
        success: true,
        message: 'Users found successfully.',
        users: result.rows,
      });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  });



app.listen(5000, () => {
    console.log(`Server is listening on port 5000..`);
});