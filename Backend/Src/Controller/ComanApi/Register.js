const usermodel = require("../../Model's/UserRegisterSchema")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const registerapi = async (req, res) => {
    try {
        const { username, Email, Password, Mobile_Number, Address } = req.body;

        console.log(Address)

        if (!username || !Email || !Password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const userExists = await usermodel.findOne({ Email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists." });
        }

        const haspassword = await bcrypt.hash(Password, 10);

        const token = await jwt.sign({ Email }, 'secret', { expiresIn: '1000h' });

        const data = await usermodel.create({
            Username: username,
            Email: Email,
            Password: haspassword,
            Mobile_Number: Mobile_Number,
            Address: Address,
            token
        });

        return res.status(200).json({
            status: "001",
            UserRegister_Data: data
        });

    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "An error occurred during registration",
            error: error.message
        });
    }
};



module.exports = registerapi