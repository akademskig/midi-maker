import { withStyles } from '@material-ui/core/styles';
import React, { Component } from "react"
import { Paper, Button, DialogContent, TextField } from "@material-ui/core";
const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        textAlign: "center"

    },
    addChannelPaper: {
        margin: "auto",
        maxWidth: "300px",
        marginTop: "200px",
        minWidth: "120px",
        padding: "10px"
    },
    button: {
        margin: "10px"
    }
});
class AddChannelForm extends Component {
    state = {
        channelName: "",
        instrument: ""
    }

    onChannelNameChange = (e) => {
        this.setState({
            channelName: e.target.value
        })
    }
    onInstrumentChange = (e) => {
        this.setState({
            instrument: e.target.value
        })
    }

    onSubmitNewChannel = () => {
        const channel = new Channel(this.state.channelName, this.state.instrument)
        this.props.onSubmitNewChannel(channel)
    }
    onCancel = () => {
        this.props.onCancel()
    }
    validateChannel = (text) => {
        return !text.length > 0
    }
    render() {
        const { classes } = this.props
        return (
            <DialogContent>
                <Paper className={classes.addChannelPaper}>
                    <form required={true} className={classes.formControl}
                        onSubmit={this.onSubmitNewChannel}
                    >
                        <TextField className={classes.textField}
                            error={this.validateChannel(this.state.channelName) ? true : false}
                            label="Name"
                            variant="outlined"
                            required
                            placeholder="channel-0"
                            autoFocus
                            onChange={this.onChannelNameChange}
                            value={this.state.channelName}
                        >
                        </TextField>
                        <Button className={classes.button} type="submit">OK</Button>
                        <Button className={classes.button} onClick={this.onCancel}>Cancel</Button>
                    </form>
                </Paper>
            </DialogContent>
        )
    }
}
export default withStyles(styles)(AddChannelForm)

class Channel {
    name = ""
    instrument = ""
    notes = []
    duration = 0
    instrumentName = ""
    color = ""
    constructor(name) {
        this.name = name
    }
}
