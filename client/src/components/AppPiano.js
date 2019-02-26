import React, { Component } from "react"
import MidiList from "../containers/MusicList";
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import SoundfontProvider from "../providers/SoundFontProvider";
import PropTypes from "prop-types"
import { LinearProgress } from "@material-ui/core";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

class AppPiano extends React.Component {
    static defaultProps = {
        notesRecorded: false,
    };

    notesList = []

    prevNote = null
    absTime = 0
    prevStopped = false
    started = false
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
        const startedNoteIndex = this.notesList.findIndex(n =>
            n.midiNumber === midiNumber
        )

        const startedNote = this.notesList.splice(startedNoteIndex, 1)
        if (!startedNote[0])
            return
        let endTime = Date.now()
        const duration = endTime - startedNote[0].startTime
        console.log(prevActiveNotes, duration, startedNote[0].startTime / 1000, endTime / 1000)

        this.recordNotes(prevActiveNotes, duration, startedNote[0].startTime);
        this.prevStopped = true

    };
    recordNotes = (midiNumbers, duration, startTime) => {
        if (this.props.recording.mode !== 'RECORDING') {
            return;
        }
        const newEvents = midiNumbers.map(midiNumber => {
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
    }

    render() {
        const {
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
            <div >
                < SoundfontProvider
                    instrumentName={instrumentName || "acoustic_grand_piano"}
                    audioContext={audioContext}
                    hostname={soundfontHostname}
                    render={({ isLoading, playNote, stopNote }) => (
                        <div style={{ height: "300px" }}>
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
export default AppPiano