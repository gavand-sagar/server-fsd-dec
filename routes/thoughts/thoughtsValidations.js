import { Validations } from "../../validator.js";

export const thoughtValidations = {
    "author": [Validations.required],
    "title": [Validations.required],
    "description": [Validations.required],
    "category": [Validations.required]
}