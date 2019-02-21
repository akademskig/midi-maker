import React, { Component } from "react"
import MidiList from "../containers/MusicList";
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import SoundfontProvider from "../providers/SoundFontProvider";
import PropTypes from "prop-types"
import { LinearProgress } from "@material-ui/core";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const DURATION_UNIT = 0.2;
const DEFAULT_NOTE_DURATION = DURATION_UNIT;

class AppPiano extends React.Component {
    static defaultProps = {
        notesRecorded: false,
    };

    state = {
        keysDown: {},
        noteDuration: DEFAULT_NOTE_DURATION,
        startBreak: 0,
        endBreak: 0,
        playing: false,
        startTime: Date.now()
    };

    duration = null
    onPlayNoteInput = midiNumber => {
        this.notesRecorded = false
        const startTime = Date.now()
        const endBreak = Date.now()
        if (this.state.playing && this.props.recording.mode !== 'RECORDING' &&
            (Math.round(this.state.startBreak / 1000) !== Math.round(endBreak / 1000))) {
            const duration = Math.round((Date.now() - this.state.startBreak) / 1000)
            this.recordNotes([null], duration);
        }

        this.setState({
            startTime,
            endBreak,
            playing: true
        });
    };

    onStopNoteInput = (midiNumber, { prevActiveNotes }) => {
        if (!this.notesRecorded) {
            const endTime = Date.now()
            const duration = ((endTime - this.state.startTime) / 1000)
            const startBreak = Date.now()
            this.recordNotes(prevActiveNotes, duration);

            this.setState({
                notesRecorded: true,
                noteDuration: duration,
                startBreak: startBreak
            });
        }
    };
    recordNotes = (midiNumbers, duration) => {
        if (this.props.recording.mode !== 'RECORDING') {
            this.prevNote = midiNumbers
            return;
        }

        this.prevNote = midiNumbers
        const newEvents = midiNumbers.map(midiNumber => {
            return {
                midiNumber,
                time: this.props.recording.currentTime,
                duration: duration,
            };
        });
        this.props.setRecording({
            events: this.props.recording.events.concat(newEvents),
            currentTime: this.props.recording.currentTime + duration,
        });
    };

    componentWillReceiveProps = (curr) => {
        if (!curr.recordingOn) {
            this.setState({
                endBreak: 0,
                startBreak: 0,
                playing: false,

            })
        }
        else {
            this.setState({
                startTime: Date.now()
            })
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