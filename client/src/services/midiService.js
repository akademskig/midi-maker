import { config } from "../config"
import Midi from "@tonejs/midi"

const apiUrl = `${window.location.protocol}//${window.location.hostname}:${config.PORT}`

export const saveMidi = (midiData, instrumentNumber) => {
    const midi = encodeMidi(midiData, instrumentNumber)
    return fetch(`${apiUrl}/midis/save`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
            //   'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(midi)
    }).then((response) => {
        return response.json()
    }).catch((err) => {
        console.log(err)
    })
}

const encodeMidi = (midiTrack, instrumentNumber) => {
    var midi = new Midi()
    // add a track

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
