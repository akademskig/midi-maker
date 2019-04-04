import React from "react";
import { MidiNumbers } from 'react-piano';
import Dimensions from '../providers/DimensionsProvider';
import _ from "lodash"
import { CircularProgress } from "@material-ui/core";
class NotesGrid extends React.Component {
    render() {
        const notes = []
        for (let i = this.props.noteRange.first; i <= this.props.noteRange.last; i++)
            notes.push(MidiNumbers.getAttributes(i))
        notes.reverse()
        const canvasContainer = this.refs.canvasContainer
        return (
            <div ref="canvasContainer" className="gridContainer" style={{
                height: this.props.height / 2, bottom: this.props.height / 5
            }}>

                <Canvas
                    controller={this.props.controller}
                    setController={this.props.setController}
                    midiOffset={this.props.noteRange.first}
                    recording={this.props.recording}
                    notes={notes}
                    playNote={this.props.playNote}
                    stopNote={this.props.stopNote}
                    loading={this.props.isLoading}
                    playAll={this.props.playAll}
                    channelColor={this.props.channelColor}
                    onClickPlay={this.props.onClickPlay}
                    canvasContainer={canvasContainer}
                    setRecording={this.props.setRecording}
                    recordingGrid={this.props.recordingGrid}
                    setRecordingGrid={this.props.setRecordingGrid}
                    channels={this.props.channels}
                    currentChannel={this.props.currentChannel}
                >
                </Canvas>)}>
            </div>
        )
    }
}

export default Dimensions(NotesGrid)
const canvasStyle = {
    background: "rgba(4,32,55,0.7)"
}
let RECT_HEIGHT = 15
const RECT_WIDTH = 30
const RECT_SPACE = 0.5
const RECT_COLOR = "rgba(4,32,55,1)"
// const FIRST_RECT_COLOR = "rgb(255,255,255)"
// const NOTE_COLOR = "#61dafb"
// const START_TIME = window.innerWidth / (RECT_WIDTH + RECT_SPACE)
const RECT_TIME = 2
const BAR_COLOR = "#d13a1f"
const RECORDING_BAR_COLOR = "#a0cf33"
const BAR_WIDTH = 4
const REC_TIME = 180
class Canvas extends React.Component {
    coordsMap = []
    eventsRect = []
    canvasWidth = null
    lastEvent = {}
    fontSize = null
    offsetFirst = null
    lastRect = null
    timers = []
    recordingTimers = []
    maxTime = 0
    state = {
        playing: false,
        timesRemained: [],
        channelColor: "#f2046d"
    }

    drawInitial = (canvas, timer, playAll) => {
        console.log(this.props.currentChannel, "canvas")
        // let joinedEvents = this.props.recordingGrid.events.concat(this.props.recording.events)
        let joinedEvents = []
        // this.time = Math.max(this.props.recordingGrid.currentTime, this.props.recording.currentTime)
        if (this.props.channels.length > 0) {
            this.props.channels.forEach(c => {
                c.notes.forEach(n => n.color = c.color)
                joinedEvents = joinedEvents.concat(c.notes)
                if (c.duration > this.time)
                    this.time = c.duration
            })
        }
        this.maxTime = this.time
        if (this.props.controller.recording && timer)
            this.time = timer
        else if (!this.time)
            this.time = 4
        let xLength = (this.time * RECT_TIME) + 5 < window.innerWidth / (RECT_WIDTH + RECT_SPACE) ? window.innerWidth / (RECT_WIDTH + RECT_SPACE) : this.time * RECT_TIME + 5
        let c = canvas.getContext("2d")
        canvas.width = (xLength * (RECT_WIDTH + RECT_SPACE))
        this.canvasWidth = canvas.width
        canvas.height = this.props.canvasContainer.getBoundingClientRect().height - 16
        RECT_HEIGHT = (canvas.height - RECT_SPACE * this.props.notes.length) / this.props.notes.length
        this.fontSize = RECT_HEIGHT * 0.8
        this.offsetFirst = this.fontSize
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
        if (joinedEvents.length > 0) {
            joinedEvents.forEach((n, i) => {
                const x = RECT_WIDTH + Math.floor(n.time * RECT_WIDTH * RECT_TIME) + this.offsetFirst
                const y = Math.floor(canvas.height - ((n.midiNumber - this.props.midiOffset) * RECT_HEIGHT + RECT_SPACE * (n.midiNumber - this.props.midiOffset))) - (RECT_HEIGHT + RECT_SPACE)
                const width = Math.floor(n.duration * RECT_WIDTH * RECT_TIME)
                c.fillStyle = n.color ? n.color : this.state.channelColor
                c.clearRect(x, y, width, RECT_HEIGHT);
                c.fillRect(x, y, width, RECT_HEIGHT);

            });
        }
        this.eventsRect.forEach(eventRect => {
            c.fillStyle = RECT_COLOR
            c.clearRect(eventRect.x, eventRect.y, RECT_WIDTH, RECT_HEIGHT);
            c.fillRect(eventRect.x, eventRect.y, RECT_WIDTH, RECT_HEIGHT);
        })
        if (timer) {
            const x = RECT_WIDTH + Math.floor(timer * RECT_WIDTH * RECT_TIME) + this.offsetFirst
            c.fillStyle = this.props.controller.recording ? RECORDING_BAR_COLOR : BAR_COLOR
            c.fillStyle = this.props.controller.playing ? BAR_COLOR : RECORDING_BAR_COLOR
            c.clearRect(x, 0, BAR_WIDTH, canvas.height)
            c.fillRect(x, 0, BAR_WIDTH, canvas.height)
            this.lastRect = x
            if (x >= this.props.canvasContainer.getBoundingClientRect().width - 200) {
                const y = 300;
                this.props.canvasContainer.scroll(x + 100, y)
            }
        }
        if (this.lastRect && !timer) {
            c.fillStyle = this.props.controller.recording ? RECORDING_BAR_COLOR : BAR_COLOR
            c.fillStyle = this.props.controller.playing ? BAR_COLOR : RECORDING_BAR_COLOR
            c.fillRect(this.lastRect, 0, BAR_WIDTH, canvas.height)
        }
    }

    play = () => {
        if (this.props.controller.playing)
            return
        const canvas = this.refs.canvas
        for (let i = 0; i < this.maxTime; i += 0.1) {
            let t = window.setTimeout(() => {
                let count = i
                this.drawInitial(canvas, count)
            }, Math.ceil(i * 1000))
            this.timers.push(t)
        }
        window.setTimeout(() => this.stop(), this.maxTime * 1000)
    }

    playAll = () => {
        if (this.props.controller.playing)
            return
        const canvas = this.refs.canvas
        for (let i = 0; i < this.maxTime; i += 0.1) {
            let t = window.setTimeout(() => {
                let count = i
                this.drawInitial(canvas, count, true)
            }, Math.ceil(i * 1000))
            this.timers.push(t)
        }
        window.setTimeout(() => this.stop(), this.maxTime * 1000)
    }
    showRecordingBar = () => {
        const timesRemained = []
        const canvas = this.refs.canvas
        for (let i = 0; i < REC_TIME; i += 0.05) {
            timesRemained.push(i)
            let t = window.setTimeout(() => {
                this.drawInitial(canvas, i)
            }, Math.floor(i * 1000))
            this.recordingTimers.push(t)
        }
        this.setState({ timesRemained })
    }

    stop = () => {
        this.timers.forEach(t => clearTimeout(t))
        this.lastRect = null
    }
    stopRecordingBar = (pause) => {
        console.log(this.props.recording.currentTime, "stop")
        const canvas = this.refs.canvas
        this.recordingTimers.forEach(t => clearTimeout(t))
        if (!pause)
            this.lastRect = null
        this.setState({ absTime: this.props.absTime })
        this.drawInitial(canvas, this.props.recording.currentTime)
    }

    resetRec = () => {
        this.setState({
            timesRemained: []
        })
    }
    resumeRec = () => {
        console.log("resume")
        const canvas = this.refs.canvas
        const tr = this.state.timesRemained
        console.log(tr, this.props.recording)
        let start = null
        for (let i = 0; i < tr.length; i++) {
            if (tr[i] < this.props.recording.currentTime)
                continue
            if (!start)
                start = tr[i]
            let t = window.setTimeout(() => {
                this.drawInitial(canvas, tr[i])

            }, Math.floor((tr[i] - start) * 1000))
            this.recordingTimers.push(t)
        }
        window.setTimeout(() => this.totalTime * 1000)

    }
    showCoords = (event) => {
        var x = event.clientX + this.props.canvasContainer.scrollLeft
        var y = event.clientY - (this.props.canvasContainer.getBoundingClientRect().top);
        const rect = this.coordsMap.find(i =>
            (x >= i.x && x <= (i.x + RECT_WIDTH)) && (y >= i.y && y <= (i.y + RECT_HEIGHT))
        )
        if (!rect)
            return
        if (rect.x >= this.props.canvasContainer.getBoundingClientRect().width - 200) {
            this.props.canvasContainer.scroll(rect.x + 100, rect.y)
        }

        const lastEvent = {
            midiNumber: rect.midiNumber,
            time: (rect.x - (RECT_WIDTH) - this.offsetFirst) / RECT_WIDTH / RECT_TIME,
            duration: 1 / RECT_TIME
        }
        if (!this.props.currentChannel || this.props.currentChannel.notes.findIndex(e => _.isEqual(e.midiNumber, lastEvent.midiNumber) && e.time === lastEvent.time) === -1) {
            this.playNote(lastEvent)
            this.props.setRecordingGrid({
                events: this.props.currentChannel ? this.props.currentChannel.notes.concat(lastEvent) : [lastEvent],
                currentTime: (lastEvent.time + lastEvent.duration) > this.props.recordingGrid.currentTime ?
                    lastEvent.time + lastEvent.duration : this.props.recordingGrid.currentTime
            })
        }
        else {
            let duplicate = this.props.currentChannel.notes.findIndex(e => _.isEqual(e.midiNumber, lastEvent.midiNumber) && e.time === lastEvent.time)
            if (duplicate !== -1 && this.props.currentChannel.notes.length > 0) {
                let lastTime = 0
                this.props.currentChannel.notes.splice(duplicate, 1)
                this.props.currentChannel.notes.forEach(e => {
                    if (lastTime < e.time)
                        lastTime = e.time
                })
                this.props.setRecordingGrid({
                    events: this.props.currentChannel.notes,
                    currentTime: (lastEvent.time + lastEvent.duration) >= this.props.recordingGrid.currentTime ?
                        lastTime + 1 / RECT_TIME : this.props.recordingGrid.currentTime
                })
            }
        }

        const canvas = this.refs.canvas
        this.drawInitial(canvas)
    }

    playNote = (lastEvent) => {
        this.props.playNote(lastEvent.midiNumber)
        window.setTimeout(() => this.props.stopNote(lastEvent.midiNumber), lastEvent.duration * 1000)
    }
    componentWillReceiveProps(newProps) {
        const canvas = this.refs.canvas
        if (this.props.currentChannel && (newProps.currentChannel.notes.length !== this.props.currentChannel.notes.length)) {
            this.drawInitial(canvas)
        }
        if (newProps.controller.playing && !this.props.controller.playing)
            this.play()
        if (newProps.channelColor !== this.props.channelColor)
            this.setState({
                channelColor: newProps.channelColor
            })
        if (!newProps.controller.playing && this.props.controller.playing)
            this.stop()

        if ((!this.props.controller.recording && newProps.controller.recording) && newProps.controller.resetRecording) {
            this.showRecordingBar()
            this.props.setController({
                resetRecording: false
            })
        }
        if ((!this.props.controller.recording && newProps.controller.recording) && (!this.props.controller.resetRecording))
            this.resumeRec()
        if (this.props.controller.recording && !newProps.controller.recording) {
            this.stopRecordingBar(true);
        }
        if (!this.props.controller.resetRecording && newProps.controller.resetRecording) {
            this.stopRecordingBar(false); this.resetRec()
        }
    }
    componentDidUpdate() {
        const canvas = this.refs.canvas
        if (canvas)
            this.drawInitial(canvas)
    }
    render() {
        return (
            <div>
                {this.props.loading ? <CircularProgress></CircularProgress> :
                    <canvas id="canvas" ref="canvas" style={canvasStyle} onClick={this.showCoords} />}
            </div>
        )
    }
}
