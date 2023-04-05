import { Validations } from "../../validator.js";

export const userValidations = {
    "username": [Validations.required],
    "password": [Validations.required],
    "avatar": [Validations.required],
}