import { Router } from "express";

import { createItem, deleteSingleItem, getAllItems, getConnection, getCount, getPagedItems, getSingleItem } from "../../mongo-db-utillities.js";
import { validateBody } from "../../validator.js";
import { songValidations } from "./songsValidations.js";
import { generateJsonMessage } from "../../commonHttpMessages.js";

const songRoutes = Router();


//create new song
songRoutes.post('',
    validateBody(songValidations),
    (req, res) => {
        const songObj = req.body;
        createItem('songs', songObj)
            .then(x => {
                res.json(x)
            })
    })

//get all songs from database
songRoutes.get('',async (req, res) => {
    let pageNumber = req.query.pageNumber;
    let itemsPerPage = req.query.itemsPerPage
    if (pageNumber) {
        return getPagedItems('songs', pageNumber, itemsPerPage)
            .then(songs => {

                return getCount('songs').then(count => {
                    return res.json({
                        total: count,
                        pageNumber: Number(pageNumber),
                        itemsPerPage: Number(itemsPerPage),
                        items: songs
                    })
                })
            }).catch(x=> {
                // throw "custom error"
                res.status(500).json(generateJsonMessage("error"))
            })
    } else {
        return getAllItems('songs')
            .then(x => {
                return res.json(x)
            })
    }

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
            res.json(generateJsonMessage("Deleted"))
        })
        .catch(err => {
            res.json(err)
        })
})





export default songRoutes

