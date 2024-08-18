import jwt from "jsonwebtoken";

const JWTService = {
  sign: (payload: object, options?: object) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      ...options,
    });
  },
  verify: (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
  },
};

export default JWTService;
