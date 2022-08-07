import Joi from "joi";
// const Joi = joi;

const location = Joi.object({
    label: Joi.string(),
    address: Joi.string().required(),
    street_number: Joi.number().integer(),
    zipcode: Joi.number().min(5).required(),
    city: Joi.string().required(),
    Lat: Joi.number().required(),
    Long: Joi.number().required()
})

const arrival = Joi.object({
    label: Joi.string(),
    address: Joi.string().required(),
    street_number: Joi.number().integer(),
    zipcode: Joi.number().min(5).required(),
    city: Joi.string().required(),
    Lat: Joi.number().required(),
    Long: Joi.number().required()
})


const userSchema = Joi.object({
    email: Joi.string().min(4).max(255).required().email(),
    password: Joi.string().min(6).max(255).uppercase(1).pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,30}$/)).required(),
    username: Joi.string().min(3).required().pattern(new RegExp(/^[a-zA-Z0-9]{3,25}$/)),
    location: location,
    arrival: arrival,
    location_id: Joi.number().integer(),
    car_id: Joi.number().integer(),
    categories: Joi.array().items(Joi.number())
});


const usernameSchema = Joi.object({
    username : Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{3,25}$/))
});

export {  userSchema, location, usernameSchema };
