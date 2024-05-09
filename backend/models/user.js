import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from 'joi';
import passwordComplexity from "joi-password-complexity";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50
    },
    lastname: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email:{
        type: String,
        required: [true, "Please provide email"],
        minlength: 3,
        maxlength: 50,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 3
    },
});

userSchema.methods.generateAuthToken = function () {  
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn:"20d" ,
    });
    return token;
};


const validate = (data) => {
	const schema = Joi.object({
		firstname: Joi.string().required().label("First Name"),
		lastname: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};
const User = mongoose.model("User", userSchema);

export { User, validate };
