"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggerMiddleware = (req, res, next) => {
    var _a;
    const startAt = process.hrtime();
    const { ip, method, originalUrl, headers, socket } = req;
    const country = headers['cf-ipcountry'];
    const ipAddress = ((_a = headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.toString().split(',').shift()) ||
        headers['cf-connecting-ip'] ||
        headers['x-real-ip'] ||
        socket.remoteAddress ||
        ip;
    res.on('finish', () => {
        const { statusCode } = res;
        const user = req.user ? req.user.id : null;
        const contentLength = req.get('content-length');
        const diff = process.hrtime(startAt);
        const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
        console.info(`${method} ${originalUrl} ${statusCode} ${(responseTime / 1000).toFixed(2)}s ${contentLength} - ${ipAddress} ${user ? user : 'anonymous'} from: ${country || 'unknown'}`);
    });
    next();
};
exports.default = loggerMiddleware;
