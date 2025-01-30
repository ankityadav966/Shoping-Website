const { z } = require('zod');

const Clientloginapi = z.object({
    username: z
        .string({ required_error: "Name is Required " })
        .trim()
        .min(3, { message: "Name must be at least 3 characters." })
        .max(300, { message: "Name must be at most 300 characters." }),

    Email: z
        .string({ required_error: "Email is Required " })
        .email({ message: "Invalid email address." })
        .min(3, { message: "Email must be at least 3 characters." })
        .max(300, { message: "Email must be at most 300 characters." }),

    Password: z
        .string({ required_error: "Password is Required " })
        .trim()
        .min(3, { message: "Password must be at least 3 characters." })
        .max(30, { message: "Password must be at most 30 characters." }),

    Mobile_Number: z
        .string()
        .regex(/^[6789]\d{9}$/, {
            message: "Invalid phone number. Must start with 6, 7, 8, or 9 and be 10 digits long.",
        })
        .length(10, { message: "Phone number must be exactly 10 digits long." }),

    Address: z.array(
        z.object({
            Address: z.string().nonempty("Address is required"),
            PinCodeNumber: z
                .string()
                .regex(/^\d{6}$/, { message: "PinCodeNumber must be a 6-digit number" }),
            village: z
                .string()
                .min(4, { message: "Village name must be at least 4 characters long" }),
        })
    ).min(1, { message: "At least one address is required" }),
});

module.exports = Clientloginapi;
