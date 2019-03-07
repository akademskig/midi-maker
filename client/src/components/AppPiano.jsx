import React from "react"
import { Piano, KeyboardShortcuts } from 'react-piano';
import SoundfontProvider from "../providers/SoundFontProvider";
import PropTypes from "prop-types"
import { LinearProgress } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import Dimensions from '../providers/DimensionsProvider';
import windowSize from 'react-window-size';

const styles = theme => ({
    piano: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,

    }
});
class AppPiano extends React.Component {
    static defaultProps = {
        notesRecorded: false,
    };

    notesList = []

    prevNote = null
    absTime = 0
    prevStopped = false
    started = false
    state={
        pianoHeight:this.props.height/3+"px"}
    onPlayNoteInput = midiNumber => {
        if (this.prevNote === midiNumber && !this.prevStopped)
            return
        if (this.props.recording.currentTime === 0 && !this.started) {
            this.setState({ absTime: Date.now() })
            this.started = true
        }
        const startTime = Date.now()
        const recordedNote = {
            midiNumber: midiNumber,
            startTime,
            endTime: null,
            duration: null
        }
        this.notesList.push(recordedNote)
        this.prevNote = midiNumber
        this.prevStopped = false
    };

    onStopNoteInput = (midiNumber, { prevActiveNotes }) => {
        if (this.props.recording.mode !== 'RECORDING') {
            return;
        }
        this.notesList = this.notesList.filter(nl =>
            prevActiveNotes.includes(nl.midiNumber)
        )
        const startedNoteIndex = this.notesList.findIndex(n =>
            n.midiNumber === midiNumber
        )
        const startedNote = this.notesList.splice(startedNoteIndex, 1)

        if (!startedNote[0])
            return
        let endTime = Date.now()
        const duration = endTime - startedNote[0].startTime

        this.recordNotes(midiNumber, duration, startedNote[0].startTime);
        this.prevStopped = true

    };
    recordNotes = (midiNumbers, duration, startTime) => {
        if (this.props.recording.mode !== 'RECORDING') {
            return;
        }

        const newEvents = [midiNumbers].map(midiNumber => {
            return {
                midiNumber,
                time: (startTime - this.state.absTime) / 1000,
                duration: duration / 1000,
            };
        });
        this.props.setRecording({
            events: this.props.recording.events.concat(newEvents),
            currentTime: (Date.now() + duration - this.state.absTime) / 1000,
        });
    };

    componentWillReceiveProps = (curr) => {
        if (curr.recordingOn && !this.props.recordingOn) {
            const elapsed = Date.now() - (this.props.recording.currentTime * 1000 + this.absTime)
            this.setState({ absTime: elapsed + this.absTime })
        }
        if(this.props.height!==curr.height)
        this.setState({
            pianoHeight: curr.height/3+"px"
        })
    }

    render() {
        console.log(this.props)
        const {
            classes,
            playNote,
            stopNote,
            recording,
            setRecording,
            noteRange,
            instrumentName,
            ...pianoProps
        } = this.props;

        const keyboardShortcuts = KeyboardShortcuts.create({
            firstNote: noteRange.first,
            lastNote: noteRange.last,
            keyboardConfig: KeyboardShortcuts.HOME_ROW,
        });
        const { mode, currentEvents } = recording;
        const activeNotes =
            mode === 'PLAYING' ? currentEvents.map(event => event.midiNumber) : null;
        return (
            <div>
                < SoundfontProvider
                    instrumentName={instrumentName || "acoustic_grand_piano"}
                    // audioContext={audioContext}
                    // hostname={soundfontHostname}
                    render={({ isLoading, playNote, stopNote }) => (
                        <div className={classes.piano} style={{height:window.innerHeight/4}}>
                            {isLoading ? <LinearProgress color="secondary" style={{ height: "5px" }}></LinearProgress> : ""}
                            <Piano

                                noteRange={noteRange}
                                playNote={playNote}
                                stopNote={stopNote}
                                disabled={isLoading}
                                keyboardShortcuts={keyboardShortcuts}
                                onPlayNoteInput={this.onPlayNoteInput}
                                onStopNoteInput={this.onStopNoteInput}
                                activeNotes={activeNotes && activeNotes[0] ? activeNotes : null}
                                {...pianoProps}

                            />
                        </div>
                    )}
                />
            </div>
        );
    }
}

AppPiano.propTypes = {
    firstNote: PropTypes.string,
    lastNote: PropTypes.string,
    instrumentName: PropTypes.string
}
export default withStyles(styles)(AppPiano)
