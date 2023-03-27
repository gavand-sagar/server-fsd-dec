import { Router } from "express";
import { upload } from "../../grid-fs.util.js";
import { createItem } from "../../mongo-db-utillities.js";
const signupRoutes = Router();

// its not s simple post req,
// its has a file with name 'avatar'
signupRoutes.post('/',
    upload.single('avatar')
    , (req, res) => {

        // the new filename that get created for you from mongodb
        let filename = req.file?.filename
        
        let obj = req.body;
        obj['avatar'] = filename
        
        createItem('users', obj).then(x => {
            return res.json("created")
        })
    })

export default signupRoutes


