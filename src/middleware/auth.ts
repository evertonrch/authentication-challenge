import { NextFunction, Request, Response } from "express"
import { validate } from "../service/token-service"

const auth = (req: any, res: Response, next: NextFunction): any => {
    const token = req.header("Authorization")
    if(!token) {
        return res.status(401).json({
            message: "token not defined"
        })
    }
    if(!validate(token)) {
        return res.status(401).json({
            message: "user cannot authenticate"
        })
    }

    next()
}

export default auth