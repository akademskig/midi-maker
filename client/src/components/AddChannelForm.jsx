import { withStyles } from '@material-ui/core/styles';
import React,{Component} from "react"
import { Paper, Grid, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Button, Modal, Input, DialogContent, TextField } from "@material-ui/core";
const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
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
    render() {
        const{ classes}= this.props
        return (
            <DialogContent>
            <Paper className="addChannelPaper">
                {/* <FormControl className={classes.formControl}>
                    <InputLabel>Instrument</InputLabel>
                    <Select
                        onChange={this.onInstrumentChange}
                        value={this.state.instrument}>
                        {this.props.instrumentList && this.props.instrumentList.map((value) => (
                            <MenuItem value={value} key={value}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl> */}
                <FormControl   required className={classes.formControl}>

                    <TextField
                    label="Name"
                   variant="outlined"
                    required
                    autoFocus
                        onChange={this.onChannelNameChange}
                        value={this.state.channelName}

                        >

                    </TextField>
                    <Button onClick={this.onSubmitNewChannel}>OK</Button>
                </FormControl>
                <div className="mt-5">


                </div>
            </Paper>
            </DialogContent>
        )
    }
}
export default  withStyles(styles)(AddChannelForm)

class Channel {
    name = ""
    instrument = ""
    notes = []
    duration=0
    instrumentName=""
    constructor(name) {
        this.name = name
    }
}
