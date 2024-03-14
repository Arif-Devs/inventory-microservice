"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("@/prisma"));
const schemas_1 = require("@/schemas");
const verifyToken = async (req, res, next) => {
    try {
        // Validate the request body
        const parsedBody = schemas_1.AccessTokenSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ errors: parsedBody.error.errors });
        }
        console.log('JWT_SECRET', process.env.JWT_SECRET);
        const { accessToken } = parsedBody.data;
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        return res.status(200).json({ message: 'Authorized', user });
    }
    catch (error) {
        next(error);
    }
};
exports.default = verifyToken;
//# sourceMappingURL=verifyToken.js.map