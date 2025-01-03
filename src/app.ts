import express, { NextFunction, Request, Response } from "express"
import auth from "./middleware/auth"
import { generate } from "./service/token-service"
import validator from "validator"
import User from "./core/user.js"

const app = express()
app.use(express.json())

const validatedBody = (req: any, res: Response, next: NextFunction): any => {
    const {email, password} = req.body as User

    if(!email || !validator.isEmail(email) || !password) {
        return res.status(400).json({
            message: "username or password is required"
        })
    }

    req.email = email
    next()
}

const errorHandler = (err, req, res, next) => {
    res.status(err.status).json({ status: err.status, detail: err.body })
    next()
}

const register = (req: any, res: Response, next: NextFunction): any => {
    const token = generate(req.email)
    res.status(200).json({ token })
    next()
}

const fooBar = (req: Request, res: Response, next: NextFunction) => {
    res.status(204).json({})
}

const handleGlobalPath = (req: Request, res, next): any => {
    res.status(404).json({
        status: 404,
        message: `${req.originalUrl} does not exists, only /register and /foo-bar are available.`
    })

    next()
}

app.use("/register", validatedBody, register, errorHandler)
app.use("/foo-bar", auth, fooBar)
app.all("*", handleGlobalPath) 

export default app