import {
    config
} from "../config"
import Midi from "@tonejs/midi"

const apiUrl = `${window.location.protocol}//${window.location.hostname}:${config.PORT}`

export const saveMidi = (midiData, instrumentNumber) => {

    const midiBody = {
        name: "test2",
        midiData
    }
    return fetch(`${apiUrl}/midis/save`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
            //   'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(midiBody)
    }).then((response) => {
        return response.blob()
    }).catch((err) => {
        console.log(err)
    })
}
