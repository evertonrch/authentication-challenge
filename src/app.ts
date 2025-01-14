import express, { NextFunction, Request, Response } from "express"
import auth from "./middleware/auth"
import { generate } from "./service/token-service"
import validator from "validator"
import User from "./core/user.js"

const app = express()
app.use(express.json())

const users: User[] = []

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

const validateUser = (req: any, res: Response, next: NextFunction): any => {
    const existsUser = users.find(user => user.email === req.email)
    if(existsUser) {
        return res.status(400).json({
            message: "there is already a registered user with this email"
        })
    }
    next()
}

const register = (req: any, res: Response, next: NextFunction): any => {
    try{
        const token = generate(req.email)
        users.push({email: req.email, password: ""})
        res.status(200).json({ token })
    } catch(e) {
        res.status(500).json({
            message: "cannot generate token."
        })
    }
}

const fooBar = (req: Request, res: Response, next: NextFunction) => {
    res.status(204).json({})
}

const handleGlobalPath = (req: Request, res, next): any => {
    return res.status(404).json({
        status: 404,
        message: `${req.originalUrl} does not exists, only /register and /foo-bar are available.`
    })
}

app.post("/register", validatedBody, validateUser, register)
app.get("/foo-bar", auth, fooBar)
app.all("*", handleGlobalPath) 

export default app