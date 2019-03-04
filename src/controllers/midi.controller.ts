import { Request, Response } from "express";
import fs from "fs"

const addNew = (req: Request, res: Response) => {
    console.log(req.body)
    res.status(200).send({ res: "Midi saved." })
    fs.writeFileSync("output.mid", Buffer.from(Array.from(req.body)))
}

export default {
    addNew
}