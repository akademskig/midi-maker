import React, { Component } from "react"
import { withStyles } from '@material-ui/core/styles';
import MusicList from "../containers/MusicList";

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: "10px",
        backgroundColor: theme.palette.primary.main,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        margin: 'auto',
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText

    },

});

class Home extends Component {
    render() {
        return (
            <div >Hi
                <MusicList></MusicList>
            </div>
        )
    }
}

export default withStyles(styles)(Home)
