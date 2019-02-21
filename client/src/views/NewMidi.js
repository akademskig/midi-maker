import React, { Component } from "react"
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from "@material-ui/core";
import AppPiano from "../components/AppPiano"

import 'react-piano/dist/styles.css';
import PianoController from "../containers/PianoController";
const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: "10px",
        backgroundColor: theme.palette.primary.main,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText

    },

});

class NewMidi extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div >

                <PianoController></PianoController>

            </div>
        )
    }
}



export default withStyles(styles)(NewMidi)