import React, { Component } from "react";
import PropTypes from "prop-types"
import { Paper, Grid, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button, Modal, Drawer, IconButton } from "@material-ui/core";
import { Settings, CloudDownload, Save } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { MidiNumbers } from 'react-piano';
import ChannelsList from "./ChannelsList"
import AddChannelForm from "./AddChannelForm"
import ColorPicker from 'material-ui-color-picker'
const styles = theme => ({
    controllerGrid: {
        marginBottom: 0
    },

    controlPaper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'left',

        color: theme.palette.text.secondary,

    },
    grid: {
        width: "100%",
        margin: 0,
    },
    gridItem: {
        display: "flex",
        flexDirection: "column",
    },
    gridItemRight: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end"
    },
    icons: {
        fontSize: "35px",
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
        color: "white"
    },
    formElements: {
        color: "black"
    },
    buttons: {
        padding: "2px",
        maxWidth: "150px",
        minWidth: "100px",
        margin: "2px",
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
        colorModal: false,
        openNav: false
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
    toggleDrawer = (open) => () => {
        this.setState({
            openNav: open,
        });
    };


    render() {
        const {
            url,
            clearLink,
            classes,
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
            onClickReset,
            playAllChannels,
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
                <Grid container spacing={24} className={classes.grid}>
                    <Grid className={classes.gridItem} item xs={1}>
                        <IconButton onClick={this.toggleDrawer(true)} ><Settings></Settings> </IconButton>

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
                        <Button className={classes.buttons} style={{ maxWidth: "150px" }} variant="contained" color="primary" onClick={onClickReset}>Reset</Button>

                    </Grid>
                    <Grid className={classes.gridItem} item xs={5}>
                        <div className="btn-row-1">
                            <Button className={classes.buttons} variant="contained" color="primary" onClick={playAllChannels}>Play</Button>
                            <Button className={classes.buttons} variant="contained" color="secondary" onClick={onClickStop}>Stop</Button>
                        </div>
                        <div className="btn-row-1">
                            <Button className={classes.buttons} variant="contained" color="secondary" onClick={onClickClear}>Clear</Button>
                            <Button className={classes.buttons} variant="contained" color="secondary" onClick={onClickUndo}>Undo</Button>
                        </div>
                    </Grid>
                    <Grid className={classes.gridItemRight} item xs={2}>
                        <div className="btn-row-1">
                            <IconButton className={classes.buttons} variant="contained" color="primary" onClick={onClickSave}>
                                <Save className={classes.icons}></Save>
                            </IconButton>
                        </div>

                        <div className="btn-row-1">
                            {url ? <a href={this.props.url} onClick={clearLink} download="file">
                                <IconButton className={classes.buttons} >
                                    <CloudDownload></CloudDownload>
                                </IconButton></a> : null}

                        </div>
                    </Grid>
                </Grid>
                <Drawer open={this.state.openNav} onClose={this.toggleDrawer(false)}>
                    <div className="ctrl-piano-config-bar">
                        <div className="c-1 forms">
                            <FormControl className={classes.formControl}>
                                <InputLabel
                                    htmlFor="first-note"
                                    className={classes.formElements}

                                >Start Note
                                    </InputLabel>
                                <Select
                                    className={classes.formElements}
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

                            <FormControl className={classes.formControl}>
                                <ColorPicker
                                    name='color'
                                    defaultValue='#f2046d'
                                    label="Channel Color"
                                    onChange={setColor}
                                />
                            </FormControl>
                        </div>
                        <div className="c-1 channels-list">
                            <ChannelsList channels={channels} selectChannel={selectChannel} removeChannel={this.removeChannel}></ChannelsList>
                            <Modal autoFocus={false} open={this.state.newChannelModal}>
                                <AddChannelForm
                                    instrumentList={instrumentList}
                                    onSubmitNewChannel={this.onSubmitNewChannel}
                                    onCancel={this.onCancel}
                                >
                                </AddChannelForm>
                            </Modal>
                        </div>
                    </div>
                </Drawer>
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



