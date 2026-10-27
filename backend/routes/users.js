import express from "express";
import {
    getAllUsers,
    getUserById,
    insertUser,
    deleteUserById,
    patchUserById,
} from "../controllers/users.js";

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);

usersRouter.get("/:user_id", getUserById);

usersRouter.post("/", insertUser);

usersRouter.delete("/:user_id", deleteUserById);

usersRouter.patch("/:user_id", patchUserById);

export default usersRouter;
