import React, { Component } from 'react';

import {
    Grid, Col, Row,
    Button, Glyphicon
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import TabledPage from '../wrappers/TabledPageParent';
import LosName from '../segments/LosName';
import SpeciesNameModal from '../segments/SpeciesNameModal';

import config from '../../config/config';

import '../../styles/custom.css';

const MODAL_SPECIES_NAME = 'showModalSpecies';

const columns = [
    {
        dataField: 'id',
        text: 'ID'
    },
    {
        dataField: 'action',
        text: 'Actions'
    },
    {
        dataField: 'type',
        text: 'Type'
    },
    {
        dataField: 'speciesName',
        text: 'Name',
        filter: textFilter()
    },
    {
        dataField: 'extra',
        text: ''
    }
];

class Checklist extends Component {

    constructor(props) {
        super(props);

        this.state = {
            [MODAL_SPECIES_NAME]: false,
            editId: 0
        }
    }

    showModal = (id) => {
        this.setState({
            [MODAL_SPECIES_NAME]: true,
            editId: id
        });
    }

    hideModal = () => {
        this.props.onTableChange(undefined, {});
        this.setState({ [MODAL_SPECIES_NAME]: false });
    }


    formatResult = (data) => {
        return data.map(n => ({
            id: n.id,
            action: <Button bsSize='xsmall' bsStyle='warning' onClick={() => this.showModal(n.id)}>Edit</Button>,
            type: n.ntype,
            speciesName: <LosName data={n} />,
            extra: <Button bsSize='xsmall' bsStyle='default'><Glyphicon glyph="chevron-right"></Glyphicon></Button>,
        }));
    }

    render() {
        return (
            <div id='names'>
                <Grid>
                    <div id="functions">
                        <Button bsStyle="success" onClick={() => this.showModal('')}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                    </div>
                    <h2>Names</h2>
                </Grid>
                <Grid fluid={true} >
                    <Row>
                        <Col sm={6}>
                            <div className="scrollable">
                                <BootstrapTable hover striped condensed
                                    remote={{ filter: true }}
                                    keyField='id'
                                    data={this.formatResult(this.props.data)}
                                    columns={columns}
                                    filter={filterFactory()}
                                    onTableChange={this.props.onTableChange}
                                />
                            </div>
                        </Col>
                        <Col sm={6}>
                            edit
                        </Col>
                    </Row>
                </Grid>
                <SpeciesNameModal id={this.state.editId} show={this.state[MODAL_SPECIES_NAME]} onHide={this.hideModal} />
            </div>
        );
    }

}

export default TabledPage({
    getAll: config.uris.listOfSpeciesUri.getAllWOrderUri,
    getCount: config.uris.listOfSpeciesUri.countUri
})(Checklist);