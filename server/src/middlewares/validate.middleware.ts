import type {Request, Response, NextFunction} from 'express';
import {ZodType, ZodError} from 'zod'


const validate = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            req.body = await schema.parseAsync(req.body);
            next();
        }catch(err){
            if(err instanceof ZodError){
                return res.status(400).json({
                    status: 'error',
                    message: err.issues[0]?.message
                });
            }
            next(err);
        }
    }
}

export default validate;