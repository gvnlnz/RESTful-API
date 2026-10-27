import User from "../database/models/userModel.js";
import { v4 as uuidv4 } from "uuid";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.send(users);
    } catch (err) {
        res.status(500).send("Errore nel recupero utenti dal database.");
    }
};

export const getUserById = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await User.getUserById(user_id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send("Utente non trovato");
        }
    } catch (err) {
        res.status(500).send("Errore nel recupero utente dal database.");
    }
};

export const insertUser = async (req, res) => {
    const { username, email, password } = req.body;
    const user_id = uuidv4();
    
    try {
        const result = await User.insertUser({
            user_id,
            username,
            email,
            password,
        });
        if (result.success) {
            res.send(`user con id ${user_id} inserito!`);
        } else {
            res.status(400).send(result.error);
        }
    } catch (err) {
        res.status(500).send("Errore nell'inserimento utente.");
    }
};

export const deleteUserById = async (req, res) => {
    const { user_id } = req.params;
    try {
        await User.delete(user_id);
        res.send(`Utente con id ${user_id} eliminato!`);
    } catch (err) {
        res.status(500).send("Errore nell'eliminazione utente.");
    }
};

export const patchUserById = async (req, res) => {
    const { user_id } = req.params;
    const { username, email, password } = req.body;
    try {
        await User.patchUserById({ user_id, username, email, password });
        res.send(`Utente con id: ${user_id} modificato!`);
    } catch (err) {
        res.status(500).send("Errore nella modifica utente.");
    }
};
