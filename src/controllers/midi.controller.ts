import { Request, Response } from "express";


const addNew = (req: Request, res: Response) => {
    console.log(req.body)
    res.status(200).send({ res: "Midi saved." })
}

export default {
    addNew
}