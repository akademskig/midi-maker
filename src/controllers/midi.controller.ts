import { Request, Response } from "express";
import fs from "fs"
import Midi from "@tonejs/midi"
import { Buffer } from "buffer";

const addNew = async (req: Request, res: Response) => {
    const { midiData} = req.body
    const midi = await encodeMidi(midiData)
    let filename = `${process.cwd()}/midis/${req.body.name.replace(/\s/g, "")}`
    fs.writeFileSync(filename + ".mid", Buffer.from(midi.toArray()))
    await converToMp3(filename)
    res.sendFile(filename + ".mp3")
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
const encodeMidi = async (midiData: Array<any>) => {
    var midi = new Midi()
    midiData.forEach(async (channel,i )=> {
        const iNum = await fetchInstrumentNumber(channel.instrumentName)

        if (iNum == null) {
            console.log(`Number not found for instrument ${channel.instrumentName}.`)
            return
        }
        const track = midi.addTrack()
        track.instrument.number = iNum
        track.name = channel.instrumentName
        track.channel=i
        channel.notes.forEach((mt: any) => {
            track.addNote({
                midi: mt.midiNumber,
                time: mt.time,
                duration: mt.duration
            })
        })
    })
    return midi
}

const fetchInstrumentNumber = async (instrument: string) => {
    const formatted = instrument.split("_").map(i => i[0].toUpperCase() + i.substring(1, i.length)).join(" ")
    let file = fs.readFileSync("./data/instrument_numbers.json").toString("utf8")
    let json = JSON.parse(file)
    for (let i = 0; i < json.instruments.length; i++) {
        if (json.instruments[i].instrument === formatted)
            return i
    }
}
export default {
    addNew
}
