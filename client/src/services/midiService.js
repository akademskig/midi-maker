import {
    config
} from "../config"

const apiUrl = `${window.location.protocol}//${window.location.hostname}:${config.PORT}`

export const saveMidi = (midiData) => {
    const midiBody = {
        name: "test2",
        midiData
    }
    return fetch(`${apiUrl}/midis/save`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(midiBody)
    }).then((response) => {
        return response.blob()
    }).catch((err) => {
        console.log(err)
    })
}
