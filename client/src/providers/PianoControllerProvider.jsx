import React from 'react';
import { saveMidi } from "../services/midiService"
import _ from 'lodash';
import InstrumentListWrapper from './InstrumentListProvider';

class PianoControllerProvider extends React.Component {

    state = {
        noteRange: {
            first: 43,
            last: 67,
        },
        instrumentName: "acoustic_grand_piano",
        recordingPiano: {
            mode: 'NOT_RECORDING',
            reset:true,
            events: [],
            currentTime: 0,
            currentEvents: [],
        },
        recordingGrid: {
            mode: 'NOT_RECORDING',
            events: [],
            currentTime: 0,
            currentEvents: [],
        },
        channels:[],
        recordingOn: false,
        absTime:0
    }
    scheduledEvents = [];

    getChannelsEndTime = () => {
        let joinedEvents = []

        if (this.state.channels.length > 0) {
            this.state.channels.map(c => {
                const notes= c.notes.map(n => {
                    return Object.assign({},n, {instrumentName: c.instrumentName})
                })
                joinedEvents = joinedEvents.concat(notes)
            })
        }
        if (joinedEvents.length === 0) {
            return 0;
        }
        return Math.max(
            ...joinedEvents.map(event => event.time + event.duration),
        );
    };
    getRecordingEndTime = () => {
        const joinedEvents=this.state.recordingPiano.events.concat(this.state.recordingGrid.events)
        if (joinedEvents.length === 0) {
            return 0;
        }
        return Math.max(
            ...joinedEvents.map(event => event.time + event.duration),
        );
    };

    setRecording = value => {
        this.setState({
            recordingPiano: Object.assign({}, this.state.recordingPiano, value),
        });
    };
    setRecordingGrid = value => {
        this.setState({
            recordingGrid: Object.assign({}, this.state.recordingGrid, value),
        });
    };

    onClickPlay = () => {
        this.setRecording({
            mode: 'PLAYING',
        });
        this.setRecordingGrid({
            mode:"PLAYING"
        })

        const joinedEvents=this.state.recordingPiano.events.concat(this.state.recordingGrid.events)
        const startAndEndTimes = _.uniq(
            _.flatMap(joinedEvents, event => [
                event.time,
                event.time + event.duration,
            ]),
        );
        startAndEndTimes.forEach((time, i) => {
            this.scheduledEvents.push(
                setTimeout(() => {
                    const currentEvents = joinedEvents.filter(event => {
                        return event.time <= time && event.time + event.duration > time
                    });
                    this.setRecording({
                        currentEvents,
                    });
                }, time * 1000),
            );
        });

        // Stop at the end
        setTimeout(() => {
            this.onFinish();
        }, this.getRecordingEndTime() * 1000);
    };
    playAllChannels=()=>{
        this.setRecording({
            mode: 'PLAYING',
        });
        this.setRecordingGrid({
            mode:"PLAYING"
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
        this.setRecording({
            mode: "NOT_RECORDING",
            currentEvents: [],
        });
        this.setRecordingGrid({
            mode: "NOT_PLAYING",
            currentEvents: [],
        });
        // this.setState({
        //     playing:false
        // })
        this.setState({ recordingOn: false })
    };
    onFinish = () => {
        this.scheduledEvents.forEach(scheduledEvent => {
            clearTimeout(scheduledEvent);
        });
        this.setRecording({
            mode: "NOT_RECORDING",
            currentEvents: [],
        });
        this.setRecordingGrid({
            mode: "NOT_PLAYING",
            currentEvents: [],
        });

        this.setState({ recordingOn: false })
    }
    onClickClear = () => {
        this.onClickStop();
        this.setRecording({
            mode: "NOT_RECORDING",
            events: [],
            reset:true,
            currentEvents: [],
            currentTime: 0,
        });
        this.setRecordingGrid({
            mode: "NOT_PLAYING",
            events: [],
            currentTime: 0,
        });
        this.setState({ recordingOn: false })
    };

    onClickUndo = () => {
        if (this.state.recordingPiano.events.length === 0) {
            return
        }
        const eventsLength = this.state.recordingPiano.events.length
        const newEvents=this.state.recordingPiano.events.slice(0, eventsLength - 1)
        this.setRecording({
            mode: "NOT_RECORDING",
            events: newEvents,
            currentTime: newEvents[newEvents.length - 1].time +newEvents[newEvents.length - 1].duration
        })
        this.setState({
            recordingOn: false,
        })
    }
    onClickSave = () => {
        const instrumentIndex = this.props.instrumentList.findIndex(i => i === this.state.instrumentName)
        saveMidi(this.state.recordingPiano.events, instrumentIndex)
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

        this.props.loadInstrument(event.target.value)
    };

    onSubmitNewChannel = (newChannel) => {
        newChannel.notes=this.state.recordingPiano.events.concat(this.state.recordingGrid.events)
        newChannel.instrumentName=this.state.instrumentName
        this.props.loadChannelInstrument(this.state.instrumentName)
        newChannel.duration=Math.max(this.state.recordingPiano.currentTime,this.state.recordingGrid.currentTime)
        const newChannelList = this.state.channels.concat(newChannel)

        this.setState({
            channels: newChannelList
        })
        this.onClickClear()
    }

    onClickReset = () => {
        this.setRecording({
            reset: true
        })
    }
    toggleRecording = (event, checked) => {
        if (checked) {
            this.setRecording({
                mode: 'RECORDING',
            });

            if (this.state.recordingPiano.events.length === 0)
                this.setState({
                    absTime: Date.now()
                })
        }
        else {
            this.setRecording({
                mode: 'NOT_RECORDING',
            });
        }
        this.setState({
            recordingOn: checked,
            paused: true
        })
    }

    render() {
        const propsToPass = {
            absTime:this.state.absTime,
            toggleRecording: this.toggleRecording,
            onChangeInstrument: this.onChangeInstrument,
            onChangeFirstNote: this.onChangeFirstNote,
            onChangeLastNote: this.onChangeLastNote,
            onClickClear: this.onClickClear,
            onClickPlay: this.onClickPlay,
            onClickSave: this.onClickSave,
            onClickStop: this.onClickStop,
            onClickUndo: this.onClickUndo,
            noteRange: this.state.noteRange,
            recordingOn: this.state.recordingOn,
            recording: this.state.recordingPiano,
            recordingGrid: this.state.recordingGrid,
            setRecording: this.setRecording,
            setRecordingGrid: this.setRecordingGrid,
            instrumentName: this.state.instrumentName,
            instrumentList: this.props.instrumentList,
            channels:this.state.channels,
            playAllChannels:this.playAllChannels,
            onSubmitNewChannel: this.onSubmitNewChannel,
        }
        return (
            React.Children.map(this.props.children, (child) => {
                return React.cloneElement(child, { ...propsToPass,...this.props });
            })
        )
    }
}

export default InstrumentListWrapper(PianoControllerProvider)
