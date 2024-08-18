"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const throwError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    error.intentional = true;
    throw error;
};
exports.default = throwError;
