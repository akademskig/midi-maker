import React, { Component } from "react"
import { withStyles } from '@material-ui/core/styles';
import AppPiano from "../components/AppPiano"

import 'react-piano/dist/styles.css';
import PianoController from "../components/PianoController";
import PianoControllerProvider from "../providers/PianoControllerProvider";

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
        return (
            <div >
                <PianoControllerProvider>
                    <PianoController ></PianoController>
                    <AppPiano ></AppPiano>
                </PianoControllerProvider>
            </div>
        )
    }
}



export default withStyles(styles)(NewMidi)