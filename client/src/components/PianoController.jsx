import React, { Component } from "react";
import PropTypes from "prop-types"
import { Paper, Grid, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button, Modal } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { MidiNumbers } from 'react-piano';
import ChannelsList from "./ChannelsList"
import AddChannelForm from "./AddChannelForm"
import ColorPicker from 'material-ui-color-picker'
const styles = theme => ({
    controllerGrid: {
        marginBottom: 0
    },
    gridItem: {
        overflow: "auto"
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
        minWidth: 80,
    },
    buttons: {
        padding: "2px",
        minWidth: "40px",
        margin: "2px",
        display: "inline-flex"
    },
    fab: {
        marginLeft: theme.spacing.unit,
        float: "right",
        padding: 0,
        width: "35px",
        height: "30px"
    },
    colorPicker: {
        zIndex: 1000,
        position: "fixed",
        padding: "10px",

    }
});

class PianoController extends Component {

    state = {
        newChannelModal: false,
        colorModal: false
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
    openColorModal = () => {
        this.setState({ colorModal: true })
    }
    removeChannel = (name) => {
        this.props.onRemoveChannel(name)
    }
    onCancel = () => {
        this.setState({
            newChannelModal: false
        })
    }

    render() {
        const {
            url,
            clearLink,
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
            selectChannel,
            setColor,
            noteRange } = this.props;
        const midiNumbersToNotes = MidiNumbers.NATURAL_MIDI_NUMBERS.reduce((obj, midiNumber) => {
            obj[midiNumber] = MidiNumbers.getAttributes(midiNumber).note;
            return obj;
        }, {});
        return (
            <div>
                <Paper className={classes.controlPaper} style={{ height: this.props.windowHeight }}>
                    <Grid container spacing={24} className={classes.controllerGrid}>
                        <Grid className={classes.gridItem} item xs={4}>
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
                                <div className="mt-5">
                                    <FormControl className={classes.formControl}>
                                        <div className={classes.colorPicker}>
                                            <ColorPicker
                                                name='color'
                                                defaultValue='#f2046d'
                                                label="Channel Color"
                                                // value={this.state.color} - for controlled component
                                                onChange={setColor}

                                            />
                                            {/* <Button style={{display:"block"}}onClick={this.closeColorPicker}>Close</Button> */}
                                        </div>
                                    </FormControl>
                                </div>

                            </form>
                        </Grid>
                        <Grid className={classes.gridItem} item xs={4}>
                            <FormControlLabel
                                label={!recordingOn ? "START RECORDING" : "STOP RECORDING"}
                                control={<Switch
                                    onChange={toggleRecording}
                                    checked={recordingOn}
                                    value={recordingOn}
                                />}>
                            </FormControlLabel>
                            <div >
                                <Button className={classes.buttons} variant="contained" color="primary" onClick={playAllChannels}>Play</Button>
                                <Button className={classes.buttons} variant="contained" color="secondary" onClick={onClickStop}>Stop</Button>
                                <Button className={classes.buttons} variant="contained" color="secondary" onClick={onClickClear}>Clear</Button>
                                <Button className={classes.buttons} variant="contained" color="secondary" onClick={onClickUndo}>Undo</Button>
                                <Button className={classes.buttons} variant="contained" color="primary" onClick={onClickSave}>Save</Button>
                                <Button className={classes.buttons} variant="contained" color="primary" onClick={onClickReset}>Reset</Button>
                            </div>
                            {url ? <a href={this.props.url} onClick={clearLink} download="file">Download</a> : null}
                            <div></div>


                        </Grid>
                        <Grid className={classes.gridItem} item xs={4}>

                            <ChannelsList channels={channels} selectChannel={selectChannel} removeChannel={this.removeChannel}></ChannelsList>
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



