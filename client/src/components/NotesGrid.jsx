import React from "react";
import { MidiNumbers } from 'react-piano';
import Dimensions from 'react-dimensions';

class NotesGrid extends React.Component {

    render() {
        const notes = []
        for (let i = this.props.noteRange.first; i <= this.props.noteRange.last; i++)
            notes.push(MidiNumbers.getAttributes(i))
            notes.reverse()
            return (
            <div className="gridContainer" style={{
                height: window.innerHeight / 2 - 30, bottom: window.innerHeight / 4
            }}>
                <Canvas
                    midiOffset={this.props.noteRange.first}
                    currentNotes={this.props.recording}
                    notes={notes}></Canvas>
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
const TOP_OFFSET = 0
const RECT_SPACE = 0.5
const RECT_COLOR =  "rgba(4,32,55,1)"
const FIRST_RECT_COLOR = "rgb(255,255,255)"
const NOTE_COLOR = "#61dafb"
const START_TIME =window.innerWidth / (RECT_WIDTH+RECT_SPACE)
const RECT_TIME=4
class Canvas extends React.Component {

    drawInitial = (canvas) => {
        let xLength = (this.props.currentNotes.currentTime* RECT_TIME)<START_TIME?START_TIME+3:this.props.currentNotes.currentTime* RECT_TIME+3
        let c = canvas.getContext("2d")
        canvas.width = (xLength*( RECT_WIDTH+RECT_SPACE))
        // canvas.height = this.props.notes.length * RECT_HEIGHT + (RECT_SPACE * this.props.notes.length)
        canvas.height=370
        RECT_HEIGHT= (canvas.height-RECT_SPACE * this.props.notes.length)/this.props.notes.length
        let FONT_SIZE= RECT_HEIGHT*0.8
        let offsetFirst=RECT_WIDTH *FONT_SIZE/7
        this.props.notes.forEach((n, i) => {
            for (let j = 0; j < xLength; j++) {

                if (j === 0) {
                    // c.fillStyle = FIRST_RECT_COLOR
                    // c.fillRect((j * RECT_WIDTH + RECT_SPACE * j), (i * RECT_HEIGHT + RECT_SPACE * i), RECT_WIDTH* FONT_SIZE/7, RECT_HEIGHT);
                    c.fillStyle = "white"
                    c.font =`${FONT_SIZE}12px Arial`
                    c.fillText(n.note,3, (RECT_HEIGHT/FONT_SIZE/2 +FONT_SIZE)+i*(RECT_HEIGHT+RECT_HEIGHT/(FONT_SIZE*2.6)))
                }
                else{

                    c.fillStyle = RECT_COLOR
                    c.fillRect((j * RECT_WIDTH+offsetFirst  + RECT_SPACE * j), (i * RECT_HEIGHT + RECT_SPACE * i), RECT_WIDTH, RECT_HEIGHT);
                }
            }
        });
        // c.fillText(n.note, 1, 12 + i * 16)
        if(this.props.currentNotes.events==0)
        return
        this.props.currentNotes.events.forEach((n, i) => {
            const x=(RECT_WIDTH* RECT_TIME+Math.floor(n.time * RECT_WIDTH* RECT_TIME)) + offsetFirst
            const y = Math.floor(canvas.height-((n.midiNumber - this.props.midiOffset) * RECT_HEIGHT + RECT_SPACE * (n.midiNumber - this.props.midiOffset)))-(RECT_HEIGHT+RECT_SPACE)
            const width=Math.floor(n.duration*RECT_WIDTH*RECT_TIME)
            c.fillStyle = NOTE_COLOR
            c.clearRect(x, y, width, RECT_HEIGHT);
            c.fillRect(x, y, width, RECT_HEIGHT);
        });
    }

    showCoords = (event) => {
        var x = event.clientX - 10;
        var y = event.clientY - 10;
        var coords = "X coordinates: " + x + ", Y coordinates: " + y;
    }
    componentWillReceiveProps(newProps) {
        const canvas = this.refs.canvas
        // this.drawInitial(canvas)
        if (newProps.currentNotes.events.length !== this.props.currentNotes.events.length) {
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
                <canvas ref="canvas" style={canvasStyle} onClick={this.showCoords} />
            </div>
        )
    }
}
