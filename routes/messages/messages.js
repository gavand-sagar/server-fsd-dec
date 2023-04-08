import { Router } from "express";
import { createItem, getAllItems } from "../../mongo-db-utillities.js";
import { validateBody } from "../../validator.js";
import { mesageValidations, typingValidations } from "./messageValidations.js";
import wssEvents from "../../web-socket-events.js";

const messageRoutes = Router();

messageRoutes.post('',
    validateBody(mesageValidations),
    (req, res) => {
        const msgObj = req.body;
        msgObj['author'] = req.headers.userObject.username;
        msgObj['time'] = new Date();
        msgObj['status'] = 'sent'
        createItem('messages', msgObj)
            .then(x => {
                msgObj['_id'] = x.insertedId;
                wssEvents.emit('send-message', msgObj)
                res.json(msgObj)
            })
    })

messageRoutes.put('/typing',
    validateBody(typingValidations),
    (req, res) => {
        const msgObj = req.body;
        msgObj['author'] = req.headers.userObject.username;
        wssEvents.emit('send-message', msgObj)
        res.json(msgObj)
    })

//get all songs from database
messageRoutes.get('', async (req, res) => {
    return getAllItems('messages')
        .then(x => {
            return res.json(x)
        })

})
export default messageRoutes

