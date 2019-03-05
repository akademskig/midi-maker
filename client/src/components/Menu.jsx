import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton'
import LibraryMusicRounded from '@material-ui/icons/LibraryMusicRounded'
import AddBoxRounded from '@material-ui/icons/AddBoxRounded'
import { withStyles } from '@material-ui/core/styles';


import { Link, withRouter } from 'react-router-dom'

const isActive = (history, path) => {
    if (history.location.pathname === path)
        return { color: '#2196f3' }
    else
        return { color: '#fff' }
}
const styles = theme => ({
    toolbar: {
        backgroundColor: theme.palette.primary.main,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
        width: "100%"
    },
    logo: {
        color: theme.palette.primary.contrastText,
        borderLeft: {
            color: theme.palette.primary.contrastText,
        },
        marginRight: "20px"
    },
    button: {
        color: theme.palette.primary.contrastText
    },
    divider: {
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.contrastText
    }

});
const Menu = withRouter(({ history, classes }) => (
    <AppBar position="static">
        <Toolbar className={classes.toolbar}>
            <Link to="/" >
                <IconButton className={classes.logo}>
                    <LibraryMusicRounded fontSize="large"></LibraryMusicRounded>

                </IconButton>
            </Link>
            <Link to="/newMidi" >
                <IconButton className={classes.button}>
                    <AddBoxRounded fontSize="large"></AddBoxRounded>
                </IconButton>
            </Link>
            <div style={{ position: "absolute", right: "10px" }}>

            </div>

        </Toolbar>
    </AppBar >
))

export default withStyles(styles)(Menu)
