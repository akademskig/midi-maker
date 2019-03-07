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
        recording: {
            mode: 'NOT_RECORDING',
            events: [],
            playing: false,
            currentTime: 0,
            currentEvents: [],
        },
        state:"STOPPED",
        recordingOn: false,
    }
    scheduledEvents = [];

    getRecordingEndTime = () => {
        if (this.state.recording.events.length === 0) {
            return 0;
        }
        return Math.max(
            ...this.state.recording.events.map(event => event.time + event.duration),
        );
    };

    setRecording = value => {
        this.setState({
            recording: Object.assign({}, this.state.recording, value),
        });
    };

    onClickPlay = () => {
        if(this.state.playing)
        return
       this.setState({
           playing:true
       })
        this.setRecording({
            mode: 'PLAYING',
            state: "PLAYING",
        });
        this.setState({ recordingOn: false })
        const startAndEndTimes = _.uniq(
            _.flatMap(this.state.recording.events, event => [
                event.time,
                event.time + event.duration,
            ]),
        );

        startAndEndTimes.forEach((time, i) => {
            this.scheduledEvents.push(
                setTimeout(() => {
                    const currentEvents = this.state.recording.events.filter(event => {
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

    onClickStop = () => {
        this.scheduledEvents.forEach(scheduledEvent => {
            clearTimeout(scheduledEvent);
        });
        this.setRecording({
            mode: "NOT_RECORDING",
            state: "STOPPED",
            currentEvents: [],
        });
        this.setState({
            playing:false
        })
        this.setState({ recordingOn: false })
    };
    onFinish = () => {
        this.scheduledEvents.forEach(scheduledEvent => {
            clearTimeout(scheduledEvent);
        });
        this.setRecording({
            mode: "NOT_RECORDING",
            state:"PLAYING",
            currentEvents: [],
        });
        this.setState({
            playing:false
        })
        this.setState({ recordingOn: false })
    }
    onClickClear = () => {
        this.onClickStop();
        this.setRecording({
            mode: "NOT_RECORDING",
            events: [],
            state: "STOPPED",
            currentEvents: [],
            currentTime: 0,
        });
        this.setState({ recordingOn: false })
    };

    onClickUndo = () => {
        if (this.state.recording.events.length === 0) {
            return
        }
        const eventsLength = this.state.recording.events.length
        const newEvents=this.state.recording.events.slice(0, eventsLength - 1)
        this.setRecording({
            mode: "NOT_RECORDING",
            events: newEvents,
            currentTime: newEvents[newEvents.length - 1].time +newEvents[newEvents.length - 1].duration
        })
        this.setState({
            recordingOn: false
        })
    }
    onClickSave = () => {
        const instrumentIndex = this.props.instrumentList.findIndex(i => i === this.state.instrumentName)
        saveMidi(this.state.recording.events, instrumentIndex)
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
    };
    onClickAddChannel = () => {

    }
    toggleRecording = (event, checked) => {
        if (checked) {
            this.setRecording({
                mode: 'RECORDING',
            });
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
            recording: this.state.recording,
            setRecording: this.setRecording,
            instrumentName: this.state.instrumentName,
            instrumentList: this.props.instrumentList
        }
        return (
            React.Children.map(this.props.children, (child) => {
                return React.cloneElement(child, { ...propsToPass });
            })
        )
    }
}

export default InstrumentListWrapper(PianoControllerProvider)
