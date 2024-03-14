"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/prisma"));
const schemas_1 = require("@/schemas");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("@/config");
//import axios from 'axios';
//import { EMAIL_SERVICE, USER_SERVICE } from '@/config';
// const generateVerificationCode = () => {
//   // Get current timestamp in milliseconds
//   const timestamp = new Date().getTime().toString();
//   // Generate a random 2-digit number
//   const randomNum = Math.floor(10 + Math.random() * 90); // Ensures 2-digit random number
//   // Combine timestamp and random number and extract last 5 digits
//   let code = (timestamp + randomNum).slice(-5);
//   return code; //
// };
const userRegister = async (req, res, next) => {
    try {
        // Validate the request body
        const parsedBody = schemas_1.UserCreateSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ errors: parsedBody.error.errors });
        }
        // check if the user already exists
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                email: parsedBody.data.email,
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // hash the password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(parsedBody.data.password, salt);
        // create the auth user
        const user = await prisma_1.default.user.create({
            data: {
                ...parsedBody.data,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                verified: true,
            },
        });
        console.log('User created: ', user);
        await axios_1.default.post(`${config_1.USER_SERVICE}/user`, {
            authUserId: user.id,
            name: user.name,
            email: user.email,
        });
        return res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.default = userRegister;
//# sourceMappingURL=userRegister.js.map