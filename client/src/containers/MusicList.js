import React, { Component } from "react";
import PropTypes from "prop-types"
class MidiList extends Component {

    item = []
    render() {
        return (
            this.item.map(i => {

                return (<MidiItem musicItem={i}></MidiItem>)
            })
        )
    }
}

class MidiItem extends Component {

    render() {
        return (
            this.props.musicItem.musicXml
            // this.song.render()
        )
    }

}

MidiItem.propTypes = {
    musicItem: PropTypes.object.isRequired
}

// MusicList.propTypes = {
//     musicItemList: PropTypes.arrayOf(PropTypes.object).isRequired
// }

export default MidiList