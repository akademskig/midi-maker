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
        filename: "file-1",
        error: false
    }

    onMidiNameChange = (e) => {
        if (!this.validateMidiName(e.target.value)) {
            this.setState({ error: true })
        } else {
            this.setState({ error: false })
        }
        this.setState({
            filename: e.target.value
        })
    }

    onMidiSave = () => {
        this.props.onMidiSave(this.state.filename)
    }
    onCancel = () => {
        this.props.onCancel()
    }
    validateMidiName = (text) => {
        return text.length > 0
    }
    render() {
        const { classes } = this.props
        return (
            <DialogContent>
                <Paper className={classes.addChannelPaper}>
                    <form required={true} className={classes.formControl}
                        onSubmit={this.onMidiSave}
                    >
                        <TextField className={classes.textField}
                            error={this.state.error}
                            label="Name"
                            variant="outlined"
                            required
                            placeholder="filename"
                            autoFocus
                            onChange={this.onMidiNameChange}
                            value={this.state.filename}
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


