import React from "react";
import { MidiNumbers } from 'react-piano';
import Dimensions from 'react-dimensions';

 class NotesGrid extends React.Component {

    render() {
        const notes = []
        for (let i = this.props.noteRange.first; i <= this.props.noteRange.last; i++)
            notes.push(MidiNumbers.getAttributes(i))

        return (
            <div className="gridContainer" style={{
             height: window.innerHeight/2, bottom:window.innerHeight/4}}>
                <Canvas containerHeight={this.props.containerHeight}containerWidth={this.props.containerWidth}notes={notes}></Canvas>

            </div>
        )
    }
}

export default Dimensions()(NotesGrid)
const canvasStyle = {
    background: "white"
}
const RECT_HEIGHT =30
const RECT_WIDTH=30
const TOP_OFFSET=0
const RECT_SPACE=1
const RECT_COLOR="rgba(3,34,56,0.5)"
class Canvas extends React.Component {


    draw = (canvas) => {

        let c = canvas.getContext("2d")
        canvas.width= this.props.containerWidth
        canvas.height=this.props.notes.length*RECT_HEIGHT + (RECT_SPACE*this.props.notes.length)

        this.props.notes.forEach((n, i)=>{
          for(let j=0; j< 100; j++){
            c.fillStyle="rgba(3,34,56,0.5)"
            c.fillRect((j*30 +RECT_SPACE*j),(i*30+RECT_SPACE*i),RECT_WIDTH,RECT_HEIGHT);
             if(j==0){
                c.fillStyle="rgba(3,34,56,0.5)"
                c.fillRect((j*30 +RECT_SPACE*j),(i*30+RECT_SPACE*i),RECT_WIDTH,RECT_HEIGHT);
                c.fillStyle="black"
                c.font="12px Arial"
                c.fillText(n.note,3, 20+i*31)}
          }
        });
    }
    showCoords = (event) => {
        var x = event.clientX - 10;
        var y = event.clientY - 10;
        var coords = "X coordinates: " + x + ", Y coordinates: " + y;
    }
    componentWillReceiveProps(){
        const canvas = this.refs.canvas
        this.draw(canvas)
    }
    componentDidUpdate() {
        const canvas = this.refs.canvas
        this.draw(canvas)
    }
    render() {
        return (
            <div>
                <canvas ref="canvas"  style={canvasStyle} onClick={this.showCoords} />
            </div>
        )
    }
}
