import { Router } from "express";
import { createItem, getAllItems } from "../../mongo-db-utillities.js";
const thoughsRouter = Router();

// to fetch all the thoughts objects from "thoughts.json"
thoughsRouter.get('', (req, res) => {
    getAllItems('thoughts')
        .then(x => {
            res.json(x)
        })
})

// to save a new object in "thoughts.json"  (post type is needed cuz its a standard)
thoughsRouter.post('', (req, res) => {

    let thoughtsObj = req.body;

    createItem('thoughts', thoughtsObj)
        .then(x => {
            res.json(process.env.APPLICATION_NAME + " - Song Added")
        })
})


export default thoughsRouter;