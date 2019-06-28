
const apiUrl = `${window.location.href}`

export const saveMidi = (midiData, filename) => {
    const midiBody = {
        name: filename,
        midiData
    }
    return fetch(`${apiUrl}midis/save`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(midiBody)
    }).then((response) => {
        return response.blob()
    }).catch((err) => {
        console.error(err)
    })
}
