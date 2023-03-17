import { Router } from "express";
import { createItem, deleteSingleItem, getAllItems, getConnection, getPagedItems, getSingleItem } from "../../mongo-db-utillities.js";

const songRoutes = Router();


//create new song
songRoutes.post('', (req, res) => {
    let songObj = req.body;
    createItem('songs', songObj)
        .then(x => {
            res.json(process.env.APPLICATION_NAME + " - Song Added")
        })
})

//get all songs from database
songRoutes.get('', (req, res) => {
    getAllItems('songs')
        .then(x => {
            res.json(x)
        })
})


songRoutes.get('/empty', (req, res) => {
    res.json([{ name: 'sagar' }])
})


songRoutes.get('', (req, res) => {
    getPagedItems('songs', 5000)
        .then(x => {
            res.json(x)
        })
})



// get a single song by id
songRoutes.get('/:id', (req, res) => {
    let id = req.params.id;

    getSingleItem('songs', id)
        .then(obj => {
            res.json(obj)
        })

})

//delete a song by Id
songRoutes.delete('/:id', (req, res) => {
    let id = req.params.id;

    deleteSingleItem('songs', id)
        .then(x => {
            res.json("Deleted")
        })
        .catch(err => {
            res.json(err)
        })
})



export default songRoutes

