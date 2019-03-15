import React, { Component } from "react";
import PropTypes from "prop-types"
import { Paper, Grid, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button, Modal, Input, DialogContent } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { MidiNumbers } from 'react-piano';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import AddChannelForm from "./AddChannelForm"
const styles = theme => ({
    controllerGrid: {
        marginBottom: 0
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

    state = {
        newChannelModal: false
    }
    onSubmitNewChannel = (channel) => {
        this.props.onSubmitNewChannel(channel)
        this.setState({
            newChannelModal: false
        })
    }
    onClickAddChannel = () => {
        this.setState({ newChannelModal: true })
    }
    onCancel = () => {
        this.setState({
            newChannelModal: false
        })
    }
    render() {
        const {
            classes,
            onClickPlay,
            onClickClear,
            onClickStop,
            onClickSave,
            onClickUndo,
            onChangeFirstNote,
            onChangeLastNote,
            instrumentName,
            instrumentList,
            toggleRecording,
            recordingOn,
            onChangeInstrument,
            recording,
            onClickReset,
            playAllChannels,
            onClickAddChannel,
            channels,
            noteRange } = this.props;
        const midiNumbersToNotes = MidiNumbers.NATURAL_MIDI_NUMBERS.reduce((obj, midiNumber) => {
            obj[midiNumber] = MidiNumbers.getAttributes(midiNumber).note;
            return obj;
        }, {});
        return (
            <div>
                <Paper className={classes.controlPaper}>
                    <Grid container spacing={24} className={classes.controllerGrid}>
                        <Grid item xs={4}>
                            <form className={classes.root} >
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="first-note">Start Note</InputLabel>
                                    <Select
                                        value={noteRange.first}
                                        name="first-note"
                                        onChange={onChangeFirstNote}
                                        inputProps={{
                                            name: 'first-note',
                                            id: 'first-note',
                                        }}
                                    >
                                        {
                                            MidiNumbers.NATURAL_MIDI_NUMBERS.map((midiNumber) =>
                                                <MenuItem value={midiNumber} disabled={midiNumber >= noteRange.last} key={midiNumber}> {midiNumbersToNotes[midiNumber]}</MenuItem>
                                            )}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>End Note</InputLabel>
                                    <Select
                                        onChange={onChangeLastNote}
                                        value={noteRange.last}>
                                        {MidiNumbers.NATURAL_MIDI_NUMBERS.map((midiNumber) => (
                                            <MenuItem value={midiNumber} disabled={midiNumber <= noteRange.first} key={midiNumber}> {midiNumbersToNotes[midiNumber]}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>Instrument</InputLabel>
                                    <Select
                                        onChange={onChangeInstrument}
                                        value={instrumentName}>
                                        {instrumentList && instrumentList.map((value) => (
                                            <MenuItem value={value} key={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </form>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControlLabel
                                className={classes.formControl}
                                label={!recordingOn ? "START RECORDING" : "STOP RECORDING"}
                                control={<Switch
                                    onChange={toggleRecording}
                                    checked={recordingOn}
                                    value={recordingOn}
                                />}>

                            </FormControlLabel>
                            <div className="mt-5">
                                <Button onClick={onClickPlay}>Play</Button>
                                <Button onClick={onClickStop}>Stop</Button>
                                <Button onClick={onClickClear}>Clear</Button>
                                <Button onClick={onClickUndo}>Undo</Button>
                                <Button onClick={onClickSave}>Save</Button>
                                <Button onClick={playAllChannels}>Play All</Button>
                                <Button onClick={onClickReset}>Reset</Button>
                            </div>
                            <div className="mt-5">
                                {/* <strong>Recorded notes</strong>
                                <div>{JSON.stringify(recording)}</div> */}
                            </div>

                        </Grid>
                        <Grid item xs={4}>
                            <ChannelsList channels={channels}></ChannelsList>
                            <Button onClick={this.onClickAddChannel}>Add Channel</Button>
                            <Modal autoFocus={false} open={this.state.newChannelModal}>
                                <AddChannelForm
                                    instrumentList={instrumentList}
                                    onSubmitNewChannel={this.onSubmitNewChannel}
                                    onCancel={this.onCancel}
                                >

                                </AddChannelForm>
                            </Modal>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(PianoController)

PianoController.propTypes = {
    classes: PropTypes.object,
    onClickPlay: PropTypes.func,
    onClickClear: PropTypes.func,
    onClickStop: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickUndo: PropTypes.func,
    onChangeFirstNote: PropTypes.func,
    onChangeLastNote: PropTypes.func,
    instrumentName: PropTypes.string,
    instrumentList: PropTypes.arrayOf(PropTypes.string),
    toggleRecording: PropTypes.func,
    recordingOn: PropTypes.bool,
    onChangeInstrument: PropTypes.func,
    noteRange: PropTypes.object
}

function ChannelsList(props) {
    return (
        <List>Channels
            {props.channels.map((c, i) => (
            <ListItem key={i}>
                <ListItemText primary={c.name} />
            </ListItem>
        ))}

        </List>
    );
}


