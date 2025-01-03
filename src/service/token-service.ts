import { verify, sign } from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_SECRET as string

const validate = (token: string): boolean => {
    try {
        verify(token, JWT_KEY)
        
        return true
    } catch(e) {
        return false
    }
}

const generate = (data: string): string => {
    return sign(data, JWT_KEY)
}

export { generate, validate }