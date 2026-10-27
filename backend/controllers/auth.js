import User from "../database/models/userModel.js";
import bcrypt from "bcryptjs";
import {v4 as uuidv4} from "uuid";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const {username, email, password} = req.body;

    // verify username
    if (!username || username.length < 5) {
        return res.json({
            status: "error",
            msg: "Username must contain at least 5 characters.",
        });
    }
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
        return res.json({status: "error", msg: "Username already exists."});
    }

    //verify email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.json({status: "error", msg: "Email non valida."});
    }
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
        return res.json({
            status: "error",
            msg: "Email already associated to an username.",
        });
    }

    //verify password
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    if (!password || !passwordRegex.test(password) || password.length < 8) {
        return res.json({
            status: "error",
            msg: `The password needs: 
                    - to contain almost an uppercase letter, a number, un a special character; 
                    - to contain almost 8 characters.`,
        });
    }

    const user_id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {user_id, username, email, password: hashedPassword};

    try {
        const result = await User.insertUser(user);
        if (result.success) {
            res.send(`user with id ${user_id} is now inserted.!`);
        } else {
            res.status(400).send(result.error);
        }
    } catch (err) {
        console.log("Mysql error: ", err);
        res.status(500).send("user insert failed.");
    }
};

	export const login = async (req, res) => {
    const {username, password} = req.body;
    // console.log(`credenziali passate al login: ${username} ${password}`)
    const user = await User.findByUsername(username);

    if (!user) {
        console.log(`user not found: ${username}`)
        return res
            .status(404)
            .json({status: "error", msg: "username or password not found."});
    }

    console.log(`user found: ${user.username} ${user.password}`);
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
            {
                id: user.user_id,
                username: user.username,
            },
            process.env.JWT_SECRET
        );
        return res.json({status: "ok", data: token})
    }
    res.status(401).json({status: "error", msg: "wrong username or password."})
};
