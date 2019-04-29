// See https://github.com/danigb/soundfont-player
// for more documentation on prop options.
import React from 'react';
import PropTypes from 'prop-types';
import Soundfont from 'soundfont-player';
import _ from "lodash"
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const hostname = 'https://d1pzp51pvbm36p.cloudfront.net';
class SoundfontProvider extends React.Component {
    static propTypes = {
        instrumentName: PropTypes.string.isRequired,
        // hostname: PropTypes.string.isRequired,
        format: PropTypes.oneOf(['mp3', 'ogg']),
        soundfont: PropTypes.oneOf(['MusyngKite', 'FluidR3_GM']),
        // audioContext: PropTypes.instanceOf(window.AudioContext),
        render: PropTypes.func,
    };

    static defaultProps = {
        format: 'mp3',
        soundfont: 'MusyngKite',
        instrumentName: 'acoustic_grand_piano',
    };
    instruments = []
    scheduledEvents = []
    constructor(props) {
        super(props);
        this.state = {
            activeAudioNodes: {},
            instrument: null,
        };
    }

    componentDidMount() {
        this.loadInstrument(this.props.instrumentName);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.instrumentName !== this.props.instrumentName) {
            this.loadInstrument(this.props.instrumentName);
        }
    }
    setInstrument(instrument) {
        this.instrument = instrument
    }
    loadInstrument = instrumentName => {
        this.setState({
            instrument: null,
        });
        return Soundfont.instrument(audioContext, instrumentName, {
            format: this.props.format,
            soundfont: this.props.soundfont,
            nameToUrl: (name, soundfont, format) => {
                return `${hostname}/${soundfont}/${name}-${format}.js`;
            },
        }).then(instrument => {
            this.setState({
                instrument,
            });
            return instrument
        });
    };
    loadChannelInstrument = (instrumentName) => {
        return Soundfont.instrument(audioContext, instrumentName, {
            format: this.props.format,
            soundfont: this.props.soundfont,
            nameToUrl: (name, soundfont, format) => {
                return `${hostname}/${soundfont}/${name}-${format}.js`;
            },
        }).then(instrument => {
            this.instruments[instrumentName] = instrument
            return instrument
        });
    };

    playAll = async (channels) => {
        let joinedEvents = []
        if (channels.length > 0) {
            channels.map(c => {
                const notes = c.notes.map(n => {
                    return Object.assign({}, n, { instrumentName: c.instrumentName })
                })
                joinedEvents = joinedEvents.concat(notes)
            })
        }
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
                    currentEvents.forEach(ce => {
                        this.play(ce.midiNumber, ce.duration, ce.instrumentName)
                    })
                }, time * 1000),
            );
        });
    }
    channelsToPlaylist = async (channels) => {
        channels.forEach(async c => {
            this.instruments[c.instrumentName] = await this.loadChannelInstrument(c.instrumentName)
        })
    }
    play = (midiNumber, duration, instrumentName) => {
        this.playNote(midiNumber, instrumentName)
       window.setTimeout(() => {
            this.stopNote(midiNumber)
        }, duration * 1000)
    }
    playNote = (midiNumber, instrumentName) => {
        audioContext.resume().then(() => {
            const audioNode = instrumentName ? this.instruments[instrumentName].play(midiNumber) : this.state.instrument.play(midiNumber);
            this.setState({
                activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
                    [midiNumber]: audioNode,
                }),
            });
        });
    };
    stopPlaying = () => {
        this.scheduledEvents.forEach(se => {
            clearTimeout(se)
        })
        this.stopAllNotes()
    }
    stopNote = midiNumber => {
        audioContext.resume().then(() => {
            if (!this.state.activeAudioNodes[midiNumber]) {
                return;
            }
            const audioNode = this.state.activeAudioNodes[midiNumber];
            audioNode.stop();
            this.setState({
                activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
                    [midiNumber]: null,
                }),
            });
        });
    };

    // Clear any residual notes that don't get called with stopNote
    stopAllNotes = () => {
        audioContext.resume().then(() => {
            const activeAudioNodes = Object.values(this.state.activeAudioNodes);
            activeAudioNodes.forEach(node => {
                if (node) {
                    node.stop();
                }
            });
            this.setState({
                activeAudioNodes: {},
            });
        });
    };

    render() {
        const props = {
            isLoading: !this.state.instrument,
            playNote: this.playNote,
            stopPlaying: this.stopPlaying,
            stopNote: this.stopNote,
            playAll: this.playAll,
            loadInstrument: this.loadInstrument,
            stopAllNotes: this.stopAllNotes,
            loadChannelInstrument: this.loadChannelInstrument
        }
        return (
            React.Children.map(this.props.children, (child) => {
                return React.cloneElement(child, { ...props });
            })
        )
    }
}

export default SoundfontProvider;
