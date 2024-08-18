"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    if (err.intentional === true) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal Server Error',
            error: {},
        });
    }
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    if (process.env.NODE_ENV === 'production') {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message ||
                'An unexpected error occurred. Please try again later.',
            error: {},
        });
    }
    else {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal Server Error',
            error: err.stack,
        });
    }
};
exports.default = errorHandler;
