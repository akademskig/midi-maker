import { Typography, withStyles, List, ListItem,  IconButton } from "@material-ui/core";
import RemoveIcon from '@material-ui/icons/Remove';
import React from "react"
const styles = theme => ({
    listItem: {
        boxShadow:theme.shadows[2],
        display:"inline-block"
    },
    list:{
        border:`solid 1px ${theme.palette.secondary.light}`,
        boxShadow:`inset ${theme.shadows[5]}`,
        height:window.innerHeight/6,
        padding:0,
        borderRadius: "3px",
    },
    button: {
        float: "right",
        padding:0,
        right:0,
        color:"white"
    }
})

function ChannelsList(props) {
    return (
        <div style={{ overflow: "auto" }}>
            <Typography style={{ display: "inline-block" }}>Channels</Typography>
            <List className={props.classes.list}>
                {props.channels.map((c, i) => (
                    <ListItem style={{backgroundColor:c.color}}onClick={props.selectChannel.bind(this,i)}className={props.classes.listItem} button  key={i}>
                        <span>{c.name}</span>
                        <IconButton color="secondary" onClick={props.removeChannel.bind(this,i)}aria-label="Remove"className={props.classes.button}><RemoveIcon></RemoveIcon></IconButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default withStyles(styles)(ChannelsList)
