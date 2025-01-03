import { NextFunction, Request, Response } from "express"
import { validate } from "../service/token-service"

const auth = (req: Request, res: Response, next: NextFunction): any => {
    const token = req.header("Authorization")
    if(!token) {
        return res.status(401).send("authenticate is required")
    }
    if(!validate(token)) {
        return res.status(401).send("authenticate is required")
    }

    next()
}

export default auth