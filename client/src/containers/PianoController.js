import React, { Component } from "react";
import PropTypes from "prop-types"
import AppPiano from "../components/AppPiano";
import { Paper, Grid, FormControl, InputLabel, Select, MenuItem, Input, Switch, FormControlLabel, Button } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { MidiNumbers } from 'react-piano';
import InstrumentListWrapper from "../providers/InstrumentListProvider";
import _ from 'lodash';

const styles = theme => ({
    controllerGrid: {
        marginBottom: "20px"
    },
    controlPaper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    backgroundDiv: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        flexGrow: 1,
        margin: "auto",
        width: "80%"
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
});

class PianoController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            noteRange: {
                first: 43,
                last: 67,
            },
            instrumentName: "",
            recording: {
                mode: 'NOT_RECORDING',
                events: [],
                currentTime: 0,
                currentEvents: [],
            },
            recordingOn: false,
            paused: true
        }
        this.scheduledEvents = [];
    }

    getRecordingEndTime = () => {
        if (this.state.recording.events.length === 0) {
            return 0;
        }
        return Math.max(
            ...this.state.recording.events.map(event => event.time + event.duration),
        );
    };

    setRecording = value => {
        this.setState({
            recording: Object.assign({}, this.state.recording, value),
        });
    };

    onClickPlay = () => {
        this.setRecording({
            mode: 'PLAYING',
        });
        this.setState({ recordingOn: false })
        const startAndEndTimes = _.uniq(
            _.flatMap(this.state.recording.events, event => [
                event.time,
                event.time + event.duration,
            ]),
        );

        startAndEndTimes.forEach((time, i) => {
            this.scheduledEvents.push(
                setTimeout(() => {
                    const currentEvents = this.state.recording.events.filter(event => {
                        return event.time <= time && event.time + event.duration > time
                    });
                    this.setRecording({
                        currentEvents,
                    });
                }, time * 1000),
            );
        });
        // Stop at the end
        setTimeout(() => {
            this.onClickStop();
        }, this.getRecordingEndTime() * 1000);
    };

    onClickStop = () => {
        this.scheduledEvents.forEach(scheduledEvent => {
            clearTimeout(scheduledEvent);
        });
        this.setRecording({
            mode: "NOT_RECORDING",
            currentEvents: [],
        });
        this.setState({ recordingOn: false })
    };
    resume = () => {
        this.setState({
            paused: false
        })
    }
    onClickClear = () => {
        this.onClickStop();
        this.setRecording({
            mode: "NOT_RECORDING",
            events: [],
            currentEvents: [],
            currentTime: 0,
        });
        this.setState({ recordingOn: false })
    };

    onClickUndo = () => {
        if (this.state.recording.events.length === 0) {
            return
        }
        const eventsLength = this.state.recording.events.length
        this.setRecording({
            mode: "NOT_RECORDING",
            events: this.state.recording.events.slice(0, eventsLength - 1),
            currentTime: this.state.recording.events[eventsLength - 1].time + this.state.recording.events[eventsLength - 1].duration
        })
        this.setState({
            recordingOn: false
        })

    }
    onChangeFirstNote = (event) => {
        this.setState({
            noteRange: {
                first: parseInt(event.target.value, 10),
                last: this.state.noteRange.last,
            },
        });
    };

    onChangeLastNote = (event) => {
        this.setState({
            noteRange: {
                first: this.state.noteRange.first,
                last: parseInt(event.target.value, 10),
            },
        });
    };
    onChangeInstrument = (event) => {
        this.setState({
            instrumentName: event.target.value,
        });
    };

    toggleRecording = (event, checked) => {
        if (checked) {
            this.setRecording({
                mode: 'RECORDING',
            });
        }
        else {
            this.setRecording({
                mode: 'NOT_RECORDING',
            });
        }
        this.setState({
            recordingOn: checked,
            paused: true
        })

    }
    render() {
        const { classes } = this.props;
        const midiNumbersToNotes = MidiNumbers.NATURAL_MIDI_NUMBERS.reduce((obj, midiNumber) => {
            obj[midiNumber] = MidiNumbers.getAttributes(midiNumber).note;
            return obj;
        }, {});

        return (
            <div className={classes.backgroundDiv}>
                <Grid container spacing={24} className={classes.controllerGrid}>
                    <Grid item xs={6}>
                        <Paper className={classes.controlPaper}>
                            <form className={classes.root} >
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="first-note">Start Note</InputLabel>
                                    <Select
                                        value={this.state.noteRange.first}
                                        name="first-note"
                                        onChange={this.onChangeFirstNote}
                                        inputProps={{
                                            name: 'first-note',
                                            id: 'first-note',
                                        }}
                                    >
                                        {
                                            MidiNumbers.NATURAL_MIDI_NUMBERS.map((midiNumber) =>
                                                <MenuItem value={midiNumber} disabled={midiNumber >= this.state.noteRange.last} key={midiNumber}> {midiNumbersToNotes[midiNumber]}</MenuItem>
                                            )}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>End Note</InputLabel>
                                    <Select
                                        onChange={this.onChangeLastNote}
                                        value={this.state.noteRange.last}>
                                        {MidiNumbers.NATURAL_MIDI_NUMBERS.map((midiNumber) => (
                                            <MenuItem value={midiNumber} disabled={midiNumber <= this.state.noteRange.first} key={midiNumber}> {midiNumbersToNotes[midiNumber]}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>Instrument</InputLabel>
                                    <Select
                                        onChange={this.onChangeInstrument}
                                        value={this.state.instrumentName}>
                                        {this.props.instrumentList && this.props.instrumentList.map((value) => (
                                            <MenuItem value={value} key={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.controlPaper}>
                            <FormControlLabel
                                className={classes.formControl}
                                label={!this.state.recordingOn ? "START RECORDING" : "STOP RECORDING"}
                                control={<Switch
                                    onChange={this.toggleRecording}
                                    checked={this.state.recordingOn}
                                    value={this.state.recordingOn}
                                />}>

                            </FormControlLabel>
                            <div className="mt-5">
                                <Button onClick={this.onClickPlay}>Play</Button>
                                <Button onClick={this.onClickStop}>Stop</Button>
                                <Button onClick={this.onClickClear}>Clear</Button>
                                <Button onClick={this.onClickUndo}>Undo</Button>
                            </div>
                            <div className="mt-5">
                                <strong>Recorded notes</strong>
                                <div>{JSON.stringify(this.state.recording)}</div>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                <AppPiano {...this.state} setRecording={this.setRecording} resume={this.resume}></AppPiano>
            </div>
        )
    }
}

export default withStyles(styles)(InstrumentListWrapper(PianoController))