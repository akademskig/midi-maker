import React from 'react';
import { saveMidi } from "../services/midiService"
import InstrumentListWrapper from './InstrumentListProvider';
import { Channel } from '../models/channel';

class PianoControllerProvider extends React.Component {

    state = {
        url: null,
        noteRange: {
            first: 43,
            last: 67,
        },
        instrumentName: "acoustic_grand_piano",
        recordingPiano: {

            events: [],
            currentTime: 0,
        },
        recordingGrid: {
            events: [],
            currentTime: 0,
        },
        controller: {
            playing: false,
            recording: false,
            resetRecording: true
        },
        channels: [],
        currentChannel: null,
        recordingOn: false,
        absTime: 0,
        channelColor: "#f2046d",
        noteDuration: 0.5
    }
    scheduledEvents = [];
    currentInstrument = "acoustic_grand_piano"
    getChannelsEndTime = () => {
        let joinedEvents = []

        if (this.state.channels.length > 0) {
            this.state.channels.map(c => {
                const notes = c.notes.map(n => {
                    return Object.assign({}, n, { instrumentName: c.instrumentName })
                })
                return joinedEvents = joinedEvents.concat(notes)
            })
        }
        if (joinedEvents.length === 0) {
            return 0;
        }
        return Math.max(
            ...joinedEvents.map(event => event.time + event.duration),
        );
    };
    setController = (value) => {
        this.setState({
            controller: Object.assign({}, this.state.controller, value),
        });
    }
    setRecording = value => {
        this.setState({
            recordingPiano: Object.assign({}, this.state.recordingPiano, value),
        });
        if (value.events)
            this.addPianoToChannel(value)
    };
    setRecordingGrid = value => {

        this.setState({
            recordingGrid: Object.assign({}, this.state.recordingGrid, value),
        });
        if (value.events) {
            this.addGridToChannel(value.events)
        }
    };
    addGridToChannel = (notes) => {
        let channel = this.state.channels.find(c => c.instrumentName === this.currentInstrument)
        if (!channel) {
            channel = new Channel(this.state.instrumentName)
            this.onSubmitNewChannel(channel)
        }
        this.setState({
            currentChannel: channel
        })
        channel.notes = notes
        notes.forEach(n => {

            channel.duration = Math.max(channel.duration, n.time + n.duration)
        })


    }
    addPianoToChannel = (event) => {
        let channel = this.state.channels.find(c => c.instrumentName === this.currentInstrument)
        if (!channel) {
            channel = new Channel(this.state.instrumentName)
            this.onSubmitNewChannel(channel)
        }
        this.setState({
            currentChannel: channel
        })
        channel.notes = event.events
        channel.notes.forEach(n => {
            channel.duration = Math.max(channel.duration ? channel.duration : 0, n.time + n.duration)
        })

    }
    playAllChannels = () => {
        //
        this.setState({
            controller: {
                playing: true
            }
        })
        this.props.playAll(this.state.channels)
        setTimeout(() => {
            this.onFinish();
        }, this.getChannelsEndTime() * 1000);
    }

    onClickStop = () => {
        this.scheduledEvents.forEach(scheduledEvent => {
            clearTimeout(scheduledEvent);
        });
        this.props.stopPlaying()
        this.setState({
            controller: {
                playing: false
            }
        })

        this.setState({ recordingOn: false })
    };
    onFinish = () => {
        this.scheduledEvents.forEach(scheduledEvent => {
            clearTimeout(scheduledEvent);
        });

        this.setState({
            controller: {
                playing: false
            }
        })
        this.setState({ recordingOn: false })
    }
    onClickClear = () => {
        this.onClickStop();
        const channel = this.state.channels.find(c => c.name === this.state.currentChannel.name)
        if (!channel)
            return
        channel.notes = []
        this.clearGrid()
        this.clearPiano()
        this.setState({ recordingOn: false })
    };

    clearGrid = () => {
        this.setState({
            recordingGrid: Object.assign({}, this.state.recordingPiano, { events: [], currentTime: 0 }),
        });
    }
    clearPiano = () => {
        this.setState({
            recordingPiano: Object.assign({}, this.state.recordingPiano, { events: [], currentTime: 0 }),
        });
    }

    onClickUndo = () => {
        if (this.state.recordingPiano.events.length === 0) {
            return
        }
        const eventsLength = this.state.recordingPiano.events.length
        const newEvents = this.state.recordingPiano.events.slice(0, eventsLength - 1)
        this.setState({
            controller: {
                recording: false
            }
        })
        this.setRecording({
            events: newEvents,
            currentTime: newEvents.length > 0 ? newEvents[newEvents.length - 1].time + newEvents[newEvents.length - 1].duration : 0
        })
    }
    onClickSave = async (filename) => {
        const blob = await saveMidi(this.state.channels, filename)
        var url = window.URL.createObjectURL(blob);
        this.setState({
            url
        })
    }
    clearLink = () => {
        this.setState({ url: null })
    }
    onChangeFirstNote = (event) => {
        this.setState({
            noteRange: {
                first: parseInt(event.target.value, 10),
                last: this.state.noteRange.last,
            },
        });
    };

    onChangeLastNote = (event) => {
        this.setState({
            noteRange: {
                first: this.state.noteRange.first,
                last: parseInt(event.target.value, 10),
            },
        });
    };
    onChangeInstrument = (event) => {
        this.setState({
            instrumentName: event.target.value,
        });
        let channel = this.state.channels.find(c => c.instrumentName === event.target.value)
        if (!channel) {
            channel = new Channel(event.target.value)
            this.onSubmitNewChannel(channel)
        }
        this.currentInstrument = event.target.value
        this.props.loadChannelInstrument(event.target.value)
        this.props.loadInstrument(event.target.value)
        this.clearGrid()
        this.clearPiano()
        this.setState({
            currentChannel: channel
        })
    };

    onSubmitNewChannel = (newChannel) => {
        newChannel.instrumentName = newChannel.name
        newChannel.duration = 0
        newChannel.color = this.state.channelColor
        const newChannelList = this.state.channels.concat(newChannel)

        this.setState({
            channels: newChannelList
        })
        this.props.loadChannelInstrument(this.state.instrumentName)
    }
    onRemoveChannel = (key) => {
        this.setState({
            channels: this.state.channels.filter((c, i) => i !== key)
        })
    }
    onSelectChannel = (key) => {
        const channel = this.state.channels[key]
        this.setState({ instrumentName: channel.instrumentName })
        this.currentInstrument = channel.instrumentName
        this.setRecordingGrid({
            events: channel.notes,
            currentTime: channel.duration,
        })
        this.props.loadInstrument(channel.instrumentName)
    }

    onClickReset = () => {
        this.setState({
            controller: Object.assign({}, this.state.controller, { resetRecording: true })
        })
        this.setRecording({
            currentTime: 0,
        })
    }
    toggleRecording = (event, checked) => {
        if (checked) {
            this.setState({
                controller: Object.assign({}, this.state.controller, { recording: true })
            })
            if (this.state.recordingPiano.events.length === 0)
                this.setState({
                    absTime: Date.now()
                })
        }
        else {
            this.setState({
                controller: Object.assign({}, this.state.controller, { recording: false })
            })
        }
        this.setState({
            recordingOn: checked,
            paused: true
        })
    }

    setColor = (color) => {
        if (color) {
            this.setState({
                channelColor: color
            })
            const channel = this.state.channels.find(c => c.instrumentName === this.state.instrumentName)
            if (channel)
                channel.color = color
        }
    }

    onChangeNoteDuration=($e)=>{
        let duration= $e.target.value
        this.setState({
            noteDuration: duration
        })
    }
    render() {
        const propsToPass = {
            url: this.state.url,
            setController: this.setController,
            controller: this.state.controller,
            clearLink: this.clearLink,
            currentChannel: this.state.currentChannel,
            absTime: this.state.absTime,
            toggleRecording: this.toggleRecording,
            onChangeInstrument: this.onChangeInstrument,
            onChangeFirstNote: this.onChangeFirstNote,
            onChangeLastNote: this.onChangeLastNote,
            onClickClear: this.onClickClear,
            onClickPlay: this.onClickPlay,
            onClickSave: this.onClickSave,
            onClickStop: this.onClickStop,
            onClickUndo: this.onClickUndo,
            onClickReset:this.onClickReset,
            noteRange: this.state.noteRange,
            recordingOn: this.state.recordingOn,
            recording: this.state.recordingPiano,
            recordingGrid: this.state.recordingGrid,
            setRecording: this.setRecording,
            setRecordingGrid: this.setRecordingGrid,
            channelColor: this.state.channelColor,
            instrumentName: this.state.instrumentName,
            instrumentList: this.props.instrumentList,
            channels: this.state.channels,
            playAllChannels: this.playAllChannels,
            onSubmitNewChannel: this.onSubmitNewChannel,
            onRemoveChannel: this.onRemoveChannel,
            onCancel: this.onCancel,
            selectChannel: this.onSelectChannel,
            setColor: this.setColor,
            noteDuration: this.state.noteDuration,
            onChangeDuration: this.onChangeNoteDuration
        }
        return (
            React.Children.map(this.props.children, (child) => {
                return React.cloneElement(child, { ...propsToPass, ...this.props });
            })
        )
    }
}

export default InstrumentListWrapper(PianoControllerProvider)
