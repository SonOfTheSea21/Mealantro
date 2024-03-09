const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Configure PostgreSQL connection
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Raiyan2411",
    database: "Mealantro2"
});

// Function to update password with pgcrypto
async function updatePasswordWithPgcrypto(userId, newPassword) {
  try {
    const client = await pool.connect();

    // Hash the new password with pgcrypto
    const hashedPassword = await client.query(
      `SELECT crypt($1, gen_salt('bf')) AS hashed_password`,
      [newPassword]
    );

    // Update the password in the database
    await client.query(
      `UPDATE users SET password = $1 WHERE user_id = $2`,
      [hashedPassword.rows[0].hashed_password, userId]
    );

    // Release the client back to the pool
    client.release();
    
    console.log(`Password updated for user with ID: ${userId}`);
  } catch (error) {
    console.error('Error updating password:', error);
  }
}

// Example usage
const userId = 'A00001';
const newPassword = 'ryan123';

updatePasswordWithPgcrypto(userId, newPassword);

