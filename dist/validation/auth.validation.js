"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
const SignupSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Name is required' })
        .min(3, {
        message: 'Name must be at least 3 characters long',
    })
        .trim(),
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address')
        .trim()
        .toLowerCase(),
    password: zod_1.z.string({ required_error: 'Password is required' }).min(6, {
        message: 'Password must be at least 6 characters long',
    }),
});
exports.SignupSchema = SignupSchema;
const LoginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address')
        .trim()
        .toLowerCase(),
    password: zod_1.z.string({ required_error: 'Password is required' }).min(6),
});
exports.LoginSchema = LoginSchema;
