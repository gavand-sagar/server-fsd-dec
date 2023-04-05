import { generateJsonMessage } from "./commonHttpMessages.js"

const requiredValidation = () => {
    return (obj, key) => {
        return obj[key] != null && obj[key] != undefined && obj[key] != ""
    }
}

export const Validations = {
    required: requiredValidation()
}


export const validateBody = (validationObj) => {

    return (req, res, next) => {

        const body = req.body;

        for (const key in validationObj) {
            if (validateAll(validationObj[key], body, key)) {
                continue;
            } else {
                res.statusCode = 400;
                return res.json(generateJsonMessage("Invalid Request Object"));
            }
        }

        next();
    }
}

function validateAll(array, body, key) {
    for (const iterator of array) {
        if (!iterator(body, key)) {
            return false
        }
    }
    return true;
}


