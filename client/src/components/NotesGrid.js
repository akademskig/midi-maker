import React from "react";
import { MidiNumbers } from 'react-piano';
export class NotesGrid extends React.Component {

    state = {
        display: "grid",
        gridTemplateColumns: "auto auto"
    }


    render() {
        const notes = []
        for (let i = this.props.noteRange.first; i <= this.props.noteRange.last; i++)
            notes.push(MidiNumbers.getAttributes(i))
        console.log(notes)

        return (
            <div className="gridContainer">
                {notes.map((n, i) => <div key={i} className="noteList" > {n.note}</div>)}
                <Canvas notes></Canvas>

            </div>
        )
    }
}

const canvasStyle = {
    border: "1px solid black"
}
class Canvas extends React.Component {
    draw = (canvas) => {

        if (canvas.getContext) {
            var context = canvas.getContext('2d');

            for (var x = 0.5; x < 100; x += 10) {
                context.moveTo(x, 0);
                context.lineTo(x, 100);
            }

            for (var y = 0.5; y < 100; y += 10) {
                context.moveTo(0, y);
                context.lineTo(100, y);

            }

            context.strokeStyle = 'grey';
            context.stroke();

        }
    }

    showCoords = (event) => {
        var x = event.clientX - 10;
        var y = event.clientY - 10;
        var coords = "X coordinates: " + x + ", Y coordinates: " + y;
        console.log(coords)
    }
    componentDidMount() {
        const canvas = this.refs.canvas
        this.draw(canvas)
    }
    render() {
        return (
            <div>
                <canvas ref="canvas" width={640} height={425} style={canvasStyle} onClick={this.showCoords} />
            </div>
        )
    }
}
export default Canvas