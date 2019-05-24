import React, { Component } from "react";
import PropTypes from "prop-types"
import { Grid, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Modal, Drawer, IconButton, InputBase, Input } from "@material-ui/core";
import { Settings, CloudDownload, Save, PlayArrow, StopRounded, UndoOutlined, SettingsBackupRestoreRounded, Clear, InputRounded } from '@material-ui/icons';
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
        display: "flex"
    },
    gridItem: {
        display: "flex",
        alignItems: "center"
    },
    gridItemRow: {
        display: "flex",
        flexDirection: "row",
        alignContent: "flex-start"

    },
    gridItemRight: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    icons: {
        fontSize: "30px",
    },
    iconButton: {
        marginRight: "1vw",
    },
    iconButtonBlue: {
        marginRight: "1vw",
        color: "rgb(71, 178, 228);"

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
        saveMidiModal: false,
        colorModal: false,
        openNav: false,
        filename: "filename"
    }
    onMidiSave = (filename) => {
        this.setState({
            saveMidiModal: false,
            filename
        })
        this.props.onClickSave(filename)
    }
    onClickSave = () => {
        this.setState({ saveMidiModal: true })
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
            noteDuration,
            onChangeDuration,
            noteRange } = this.props;
        const midiNumbersToNotes = MidiNumbers.NATURAL_MIDI_NUMBERS.reduce((obj, midiNumber) => {
            obj[midiNumber] = MidiNumbers.getAttributes(midiNumber).note;
            return obj;
        }, {});
        return (
            <div>
                <Grid container spacing={24} className={classes.grid}>
                    <Grid className={classes.gridItem} item xs={1}>
                        <div className="btn-row-1">
                            <IconButton title="Piano settings" onClick={this.toggleDrawer(true)} ><Settings></Settings> </IconButton>
                        </div>
                    </Grid>
                    <Grid className={classes.gridItemRow} item xs={2}>
                        <FormControlLabel
                            title="Record"
                            label={"REC"}
                            control={<Switch
                                onChange={toggleRecording}
                                checked={recordingOn}
                                value={recordingOn}
                            />}>

                        </FormControlLabel>
                        <div className="btn-row-1">
                            <IconButton title="Reset recording" className={classes.iconButton} variant="contained" color="primary" onClick={onClickReset}>
                                <SettingsBackupRestoreRounded className={classes.icons}></SettingsBackupRestoreRounded>
                            </IconButton>
                        </div>
                    </Grid>
                    <Grid className={classes.gridItemRow} item xs={3}>
                        <div className="btn-row-1">
                            <IconButton title="Undo" className={classes.iconButton} variant="contained" color="secondary" onClick={onClickUndo}>
                                <UndoOutlined className={classes.icons}>
                                </UndoOutlined>
                            </IconButton>
                        </div>
                        <div className="btn-row-1">

                            <IconButton title="Clear notes" className={classes.iconButton} variant="contained" color="secondary" onClick={onClickClear}>
                                <Clear className={classes.icons}></Clear>
                            </IconButton>
                        </div>
                    </Grid>
                    <Grid className={classes.gridItemRow} item xs={4}>
                        <div className="btn-row-1">
                            <IconButton title="Play" className={classes.iconButtonBlue} variant="contained" onClick={playAllChannels}>
                                <PlayArrow className={classes.icons}></PlayArrow>
                            </IconButton>
                        </div>
                        <div className="btn-row-1">
                            <IconButton title="Stop" className={classes.iconButton} variant="contained" color="secondary" onClick={onClickStop}>
                                <StopRounded className={classes.icons}></StopRounded>
                            </IconButton>
                        </div>
                    </Grid>
                    <Grid className={classes.gridItemRight} item xs={2}>
                        <div className="btn-row-1">
                            {url ? <a href={this.props.url} onClick={clearLink} download={this.state.filename}>
                                <IconButton title="Download" className={classes.iconButtonBlue} >
                                    <CloudDownload className={classes.icons}></CloudDownload>
                                </IconButton></a> : null}
                        </div>
                        <div className="btn-row-1">
                            <IconButton title="Save" className={classes.iconButton} variant="contained" color="primary" onClick={this.onClickSave}>
                                <Save className={classes.icons}></Save>
                            </IconButton>
                        </div>
                        <Modal autoFocus={false} open={this.state.saveMidiModal}>
                            <AddChannelForm
                                onMidiSave={this.onMidiSave}
                                onCancel={this.onCancel}
                            >
                            </AddChannelForm>
                        </Modal>
                    </Grid>
                </Grid>
                <Drawer open={this.state.openNav} onClose={this.toggleDrawer(false)}>
                    <div className="ctrl-piano-config-bar">
                        <div className="config-bar-title">
                            <Settings></Settings>
                            <p>PIANO/GRID SETTINGS</p>
                        </div>
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
                                <InputLabel>Note Duration (seconds)</InputLabel>
                                <Input
                                    type="number"
                                    value={noteDuration}
                                    onChange={onChangeDuration.bind(this)}
                                    inputProps={{
                                        min: 0.1,
                                        step: 0.1
                                    }}
                                ></Input>
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



