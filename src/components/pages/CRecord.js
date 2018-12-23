import React, { Component } from 'react';

import axios from 'axios';
import template from 'url-template';

import config from '../../config/config';

class Record extends Component {

    constructor(props) {
        super(props);

        this.getByIdUri = template.parse(config.uris.chromosomeDataUri.getById);
        this.state = {
            record: {}
        };
    }

    componentDidMount() {
        const recordId = this.props.match.params.recordId;
        if (recordId) {
            const uri = this.getByIdUri.expand({ id: recordId });
            axios.get(uri).then(response => {
                this.setState({ record: response.data });
            }).catch(e => console.error(e));
        }
    }

    render() {
        return (
            <div id="chromosome-record">
                <h2>Chromosome record</h2>
                {JSON.stringify(this.state.record)}
            </div>
        );
    }

}

export default Record;