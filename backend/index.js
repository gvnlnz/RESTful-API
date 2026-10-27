import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import {authentication} from "./middlewares/auth.js";
import {conn} from "./database/conn.js";
import path from "path";

dotenv.config()
const app = express();

app.use(express.json())
app.use(cors())

app.use('/users', authentication, usersRouter) // the 'authentication' middleware protects routes from users
app.use('/auth', authRouter)

app.use('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), "index.html"));
})

conn.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        process.exit(1);
    } else {
        console.log("Connected to MySQL database");
    }
});

app.set("db", conn);

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`server listening on port ${process.env.PORT}`)
})
