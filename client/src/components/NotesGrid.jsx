import React from "react";
import { MidiNumbers } from 'react-piano';
import Dimensions from 'react-dimensions';
import _ from "lodash"

class NotesGrid extends React.Component {
    render() {
        const notes = []
        for (let i = this.props.noteRange.first; i <= this.props.noteRange.last; i++)
            notes.push(MidiNumbers.getAttributes(i))
        notes.reverse()
        const canvasContainer = this.refs.canvasContainer
        return (
            <div ref="canvasContainer" className="gridContainer" style={{
                height: window.innerHeight / 2 - 30, bottom: window.innerHeight / 4
            }}>
                <Canvas
                    midiOffset={this.props.noteRange.first}
                    recording={this.props.recording}
                    notes={notes}
                    canvasContainer={canvasContainer}
                    setRecording={this.props.setRecording}
                >
                </Canvas>
            </div>
        )
    }
}

export default Dimensions()(NotesGrid)
const canvasStyle = {
    background: "rgba(4,32,55,0.7)"
}
let RECT_HEIGHT = 15
const RECT_WIDTH = 15
const RECT_SPACE = 0.5
const RECT_COLOR = "rgba(4,32,55,1)"
const FIRST_RECT_COLOR = "rgb(255,255,255)"
const NOTE_COLOR = "#61dafb"
const START_TIME = window.innerWidth / (RECT_WIDTH + RECT_SPACE)
const RECT_TIME = 10
class Canvas extends React.Component {
    coordsMap = []
    eventsRect = []
    canvasWidth = null
    lastEvent = {}
    fontSize = null
    offsetFirst = null

    drawInitial = (canvas) => {
        let xLength = (this.props.recording.currentTime * RECT_TIME) < START_TIME ? START_TIME + 3 : this.props.recording.currentTime * RECT_TIME + 3
        let c = canvas.getContext("2d")
        canvas.width = (xLength * (RECT_WIDTH + RECT_SPACE))
        this.canvasWidth = canvas.width
        canvas.height = 370
        RECT_HEIGHT = (canvas.height - RECT_SPACE * this.props.notes.length) / this.props.notes.length
        this.fontSize = RECT_HEIGHT * 0.8
        this.offsetFirst = RECT_WIDTH * this.fontSize / 7
        this.coordsMap = []
        this.props.notes.forEach((n, i) => {
            for (let j = 0; j < xLength; j++) {
                if (j === 0) {
                    c.fillStyle = "white"
                    c.font = `${this.fontSize}12px Arial`
                    c.fillText(n.note, 3, (RECT_HEIGHT / this.fontSize / 2 + this.fontSize) + i * (RECT_HEIGHT + RECT_HEIGHT / (this.fontSize * 2.6)))
                }
                else {
                    let x = j * RECT_WIDTH + this.offsetFirst + RECT_SPACE * j
                    let y = i * RECT_HEIGHT + RECT_SPACE * i
                    c.fillStyle = RECT_COLOR
                    c.fillRect(x, y, RECT_WIDTH, RECT_HEIGHT);
                    this.coordsMap.push({ midiNumber: n.midiNumber, x, y })
                }
            }
        });
        if (this.props.recording.events.length > 0) {
            this.props.recording.events.forEach((n, i) => {
                const x = RECT_WIDTH + Math.floor(n.time * RECT_WIDTH * RECT_TIME) + this.offsetFirst
                const y = Math.floor(canvas.height - ((n.midiNumber - this.props.midiOffset) * RECT_HEIGHT + RECT_SPACE * (n.midiNumber - this.props.midiOffset))) - (RECT_HEIGHT + RECT_SPACE)
                const width = Math.floor(n.duration * RECT_WIDTH * RECT_TIME)
                c.fillStyle = NOTE_COLOR
                c.clearRect(x, y, width, RECT_HEIGHT);
                c.fillRect(x, y, width, RECT_HEIGHT);
            });
        }
        if (this.eventsRect.length === 0) {
            return
        }
        this.eventsRect.forEach(eventRect => {
            c.fillStyle = NOTE_COLOR
            c.clearRect(eventRect.x, eventRect.y, RECT_WIDTH, RECT_HEIGHT);
            c.fillRect(eventRect.x, eventRect.y, RECT_WIDTH, RECT_HEIGHT);
        })
    }

    showCoords = (event) => {
        var x = event.clientX + this.props.canvasContainer.scrollLeft
        var y = event.clientY - 240;
        const rect = this.coordsMap.find(i =>
            (x >= i.x && x <= (i.x + RECT_WIDTH)) && (y >= i.y && y <= (i.y + RECT_HEIGHT))
        )
        if (!rect || this.props.recording.mode !== "RECORDING")
            return
        const lastEvent = {
            midiNumber: rect.midiNumber,
            time: (rect.x - (RECT_WIDTH) - this.offsetFirst) / RECT_WIDTH / RECT_TIME,
            duration: 1 / RECT_TIME
        }
        this.props.setRecording({
            events: this.props.recording.events.concat(lastEvent),
        })
        const canvas = this.refs.canvas
        this.drawInitial(canvas)
    }
    componentWillReceiveProps(newProps) {
        const canvas = this.refs.canvas
        if (newProps.recording.events.length !== this.props.recording.events.length) {
            this.drawInitial(canvas)
        }
    }
    componentDidUpdate() {
        const canvas = this.refs.canvas
        this.drawInitial(canvas)
    }
    render() {
        return (
            <div>
                <canvas id="canvas" ref="canvas" style={canvasStyle} onClick={this.showCoords} />
            </div>
        )
    }
}
