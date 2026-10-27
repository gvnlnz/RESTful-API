import jwt from "jsonwebtoken";

export const authentication = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader ? authHeader.split(' ')[1] : undefined

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        console.log(error);
        if (error) return res.sendStatus(401);
        req.user = user; // without this, routes may return errors.
        next();
    });
};
