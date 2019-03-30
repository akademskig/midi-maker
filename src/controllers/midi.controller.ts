import { Request, Response } from "express";
import fs from "fs"
import Midi from "@tonejs/midi"
import { Buffer } from "buffer";

const addNew = async (req: Request, res: Response) => {
    const { midiData, instrumentNumber, name } = req.body
    const midi = encodeMidi(midiData, instrumentNumber)

    let filename = `${process.cwd()}/midis/${req.body.name.replace(/\s/g, "")}`
    fs.writeFileSync(filename + ".mid", Buffer.from(midi.toArray()))

    await converToMp3(filename)
    res.sendFile(filename+".mp3")
}

const converToMp3 = async (file: string) => {
    return new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        exec(`timidity -Ow -o - ${file}.mid | lame -  ${file}.mp3`, (err: Error, stdout: any, stderr: any) => {
            if (err) {
                console.error(err)
                reject(err)
                return;
            }            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            resolve()
        });
    })

}
const encodeMidi = (midiTrack: Array<any>, instrumentNumber: number) => {
    var midi = new Midi()

    const track = midi.addTrack()
    track.instrument.number = instrumentNumber
    midiTrack.forEach(mt => {
        track.addNote({
            midi: mt.midiNumber,
            time: mt.time,
            duration: mt.duration
        })
    })
    return midi
}

export default {
    addNew
}
