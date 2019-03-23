import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Grid, Glyphicon } from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import TabledPage from '../wrappers/TabledPageParent';
import PersonModal from '../segments/PersonModal';

import config from '../../config/config';

const MODAL_PERSONS = 'showModalPerson';

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
        dataField: 'person',
        text: 'Person(s) Name'
    }
];

class Persons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            [MODAL_PERSONS]: false,
            editId: 0
        }
    }

    showModal = id => {
        this.setState({
            [MODAL_PERSONS]: true,
            editId: id
        });
    }

    hideModal = () => {
        this.props.onTableChange(undefined, { page: this.props.paginationOptions.page, sizePerPage: this.props.paginationOptions.sizePerPage, filters: {} });
        this.setState({ [MODAL_PERSONS]: false });
    }

    formatResult = data => {
        return data.map(p => ({
            id: p.id,
            action: <Button bsSize='xsmall' bsStyle="warning" onClick={() => this.showModal(p.id)}>Edit</Button>,
            person: p.persName
        }));
    }

    render() {
        return (
            <div id='persons'>
                <Grid id="functions">
                    <div id="functions">
                        <Button bsStyle="success" onClick={() => this.showModal('')}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                    </div>
                    <h2>Persons</h2>
                </Grid>
                <Grid fluid={true}>
                    <BootstrapTable hover striped condensed
                        remote={{ filter: true, pagination: true }}
                        keyField='id'
                        data={this.formatResult(this.props.data)}
                        columns={columns}
                        filter={filterFactory()}
                        onTableChange={this.props.onTableChange}
                        pagination={paginationFactory(this.props.paginationOptions)}
                    />
                </Grid>
                <PersonModal id={this.state.editId} show={this.state[MODAL_PERSONS]} onHide={this.hideModal} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(
    TabledPage({
        getAll: config.uris.personsUri.getAllWFilterUri,
        getCount: config.uris.personsUri.countUri
    })(Persons)
);
