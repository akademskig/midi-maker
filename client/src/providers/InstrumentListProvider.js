
import React from 'react';
import PropTypes from 'prop-types';
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const InstrumentListWrapper = (ComponentToWrap) => {
    return class InstrumentListProvider extends React.Component {

        static defaultProps = {
            soundfont: 'MusyngKite',
        };

        state = {
            instrumentList: null,
            instrumentsLoading: true
        };

        componentWillMount = () => {
            this.loadInstrumentList();
        }

        loadInstrumentList = () => {
            fetch(`${soundfontHostname}/${this.props.soundfont}/names.json`)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({
                        instrumentList: data,
                        instrumentsLoading: false
                    });
                });
        };

        render() {
            return (
                <ComponentToWrap
                    {...this.props}
                    instrumentList={this.state.instrumentList}
                    instrumentsLoading={this.state.instrumentsLoading}
                />
            )
        }
    }
}

export default InstrumentListWrapper;
