import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({email});

        if (!existingUser)
            return res.status(404).json({ message: "User does not exits!" });

        const checkPassword = bcrypt.compare(password, existingUser.password);

        if (!checkPassword)
            return res.status(400).json({ message: "Password not correct!" });

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            'test',
            { expiresIn: '1h' });

        res.status(200).json({ result: existingUser, token });

    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });
    }

}

export const signUp = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    
    try {

        const existingUser = await User.findOne({email});
        
        if(existingUser)
            return res.status(400).json({message: "User Already Exits"});
        if(password !== confirmPassword)
            return res.status(400).json({message: "Password and Confirm Password did not match"});
        
        const hashedPassword = await bcrypt.hash(password,12);
        
        const result = await User.create({ name: `${firstName} ${lastName}`, email: email, password: hashedPassword});

        const token = jwt.sign(
            { email: result.email, id: result._id },
            'test',
            { expiresIn: '1h' });
        
        res.status(201).json({ result, token });

    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong"});
        console.log(error);
    }
}