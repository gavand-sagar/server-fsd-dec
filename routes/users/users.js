import { Router } from "express";
import { getAllItems } from "../../mongo-db-utillities.js";
import jwt from 'jsonwebtoken'
const userRoutes = Router();
userRoutes.get('/generate-token', (req, res) => {

    // create a token and return the token only when user present in the database
    let obj = {
        username: req.headers.name
    }

    getAllItems('users', { username: req.headers.name,password:req.headers.pass }).then(allusers => {
        if(allusers && allusers.length > 0){
            let user = allusers[0]
            let token = jwt.sign(obj, process.env.SECRETE_KEY, { expiresIn: process.env.TOKEN_EXPIRES_IN })
            return res.json({ token: token, avatar: user.avatar })
        }else{
            return res.json({ token: "" })
        }
        
    })

    // generate a token

})

// userRoutes.get('/', (req, res) => {
//     getAllItems('users')
//         .then(x => {
//             return res.json(x)

//         })
// })

export default userRoutes


