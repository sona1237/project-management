import express from "express";
import { User, validate } from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        console.log("Received request to create user:", req.body);

        const { error } = validate(req.body);
        if (error) {
            console.log("Validation error:", error);
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await User.findOne({ email: req.body.email });
        if (user) {
            console.log("User already exists:", user);
            return res.status(409).send({ message: "User with given email already exists!" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({ ...req.body, password: hashPassword });
        console.log("Creating new user:", newUser);

        await newUser.save();
        console.log("User created successfully");

        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export default router;
