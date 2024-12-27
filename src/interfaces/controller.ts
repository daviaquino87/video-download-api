import {Request, Response} from "express"

export interface IController<T> {
    handler(req: Request, res: Response): Promise<T>;
}