import { getAllItems } from "./mongo-db-utillities.js"
import jwt from "jsonwebtoken"

export const authorizeFromDatabase = (req, res, next) => {
    //go check the database (this is something which is not that good)
    getAllItems('users', {
        username: req.headers.name,
        password: req.headers.pass
    }).then(u => {
        //if user exists
        if (u != null && u.length > 0) {
            // go and execute the request
            next()
        } else {
            //send dummy response
            res.json("Un Authorized")
        }
    })
}

export const authorizeFromToken = (req, res, next) => {

    let token = req.headers.token;

    try {
        const result = jwt.verify(token, process.env.SECRETE_KEY);
        next()
    } catch {
        return res.json("Un Authorized")
    }
}