import React, { Component } from "react"
import { withStyles } from '@material-ui/core/styles';
import AppPiano from "../components/AppPiano"

import 'react-piano/dist/styles.css';
import PianoController from "../components/PianoController";
import PianoControllerProvider from "../providers/PianoControllerProvider";
import NotesGrid  from "../components/NotesGrid";
import SoundfontProvider from "../providers/SoundFontProvider";

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
                <SoundfontProvider>
                <PianoControllerProvider>
                    <PianoController ></PianoController>
                    <NotesGrid></NotesGrid>
                    <AppPiano ></AppPiano>
                </PianoControllerProvider>
                </SoundfontProvider>
            </div>
        )
    }
}



export default withStyles(styles)(NewMidi)
