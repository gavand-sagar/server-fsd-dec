import { MongoClient, ObjectId } from "mongodb";

export function getConnection() {
    const connectionStirng = process.env.CONNECTION_STRING;
    const sagarConnection = new MongoClient(connectionStirng)
    return sagarConnection;
}

export function getAllItems(collectionName,query) {
    return getConnection().connect().then(client => {
        const db = client.db(process.env.DEFAULT_DATABASE)
        return db.collection(collectionName)
            .find(query)
            .toArray()
    })
}


export function createItem(collectionName, obj) {
    return getConnection().connect().then(client => {
        const db = client.db(process.env.DEFAULT_DATABASE)
        return db.collection(collectionName)
            .insertOne(obj)

    })
}


export function deleteSingleItem(collectionName, id) {
    return getConnection().connect().then(client => {
        const db = client.db(process.env.DEFAULT_DATABASE)
        return db.collection(collectionName)
            .deleteOne({
                "_id": new ObjectId(id)
            })

    })
}


export function getSingleItem(collectionName, id) {
    return getConnection().connect().then(client => {
        const db = client.db(process.env.DEFAULT_DATABASE)
        return db.collection(collectionName)
            .findOne({
                "_id": new ObjectId(id)
            })

    })
}


export function updateSingleItem(collectionName, id, obj) {
    return getConnection().connect().then(client => {
        const db = client.db(process.env.DEFAULT_DATABASE)
        return db.collection(collectionName)
            .updateOne({
                "_id": new ObjectId(id)
            }, obj)

    })
}


export function getPagedItems(collectionName, noOfItems) {
    return getConnection().connect().then(client => {
        const db = client.db(process.env.DEFAULT_DATABASE)
        return db.collection(collectionName)
            .aggregate([
                { $limit: noOfItems }
            ]).toArray()
    })
}

