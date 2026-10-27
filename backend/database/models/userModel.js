import mysql from 'mysql2/promise';
import dotenv from "dotenv"

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const User = {
    async getAllUsers() {
        const [rows] = await pool.query('SELECT * FROM USERS');
        return rows;
    },

    async getUserById(user_id) {
        const [result] = await pool.query('SELECT * FROM USERS WHERE user_id = ?', [user_id]);
        return result[0];
    },

    async insertUser(user) {
        const { user_id, username, email, password } = user;
        const [result] = await pool.query(
            'INSERT INTO USERS (user_id, username, email, password) VALUES (?, ?, ?, ?)',
            [user_id, username, email, password]
        );
        if (result.affectedRows === 1) {
            return { success: true, insertId: result.insertId };
        } else {
            return { success: false, error: 'User not inserted' };
        }
    },

    async patchUserById(user) {
        const { user_id, username, email, password } = user;
        await pool.query(
            'UPDATE USERS SET username = ?, email = ?, password = ? WHERE user_id = ?',
            [username, email, password, user_id]
        );
    },

    async delete(user_id) {
        await pool.query('DELETE FROM USERS WHERE user_id = ?', [user_id]);
    },

    async findByUsername(username) {
        const [rows] = await pool.query('SELECT * FROM USERS WHERE username = ?', [username]);
        return rows.length > 0 ? rows[0] : null;
    },

    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM USERS WHERE email = ?', [email]);
        return rows.length > 0;
    },
};

export default User;