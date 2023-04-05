import { Validations } from "../../validator.js";

export const songValidations = {
    songName: [Validations.required],
    songImage: [Validations.required],
    rating: [Validations.required]
}