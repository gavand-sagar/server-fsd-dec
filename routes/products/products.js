import { Router } from "express"
import { createItem, deleteSingleItem, getAllItems, getConnection, getSingleItem, updateSingleItem } from "../../mongo-db-utillities.js";

const productRoutes = Router();

//get all products
productRoutes.get('', (req, res) => {
    getAllItems('products')
        .then(x => {
            res.json(x)
        })
})

//get single product
productRoutes.get('/:id', (req, res) => {
    const id = req.params.id
    getSingleItem('products', id)
        .then(x => {
            res.json(x)
        })

})

//create new
productRoutes.post('', (req, res) => {
    const productObj = req.body

    createItem('products', productObj)
        .then(x => {
            res.json("product created")
        })

})

//update
productRoutes.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    updateSingleItem('products', id, body)
        .then(x => {
            req.json("product updated successfully.d")
        })
})

//delete
productRoutes.delete('/:id', (req, res) => {

    const id = req.params.id

    deleteSingleItem('products', id)
        .then(x => {
            res.json("product deleted")
        })

})

export default productRoutes
