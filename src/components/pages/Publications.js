import React, { Component } from 'react';

import { Button, Grid, Glyphicon } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import TabledPage from '../wrappers/TabledPageParent';
import PublicationModal from '../segments/PublicationModal';

import helper from '../../utils/helper';
import config from '../../config/config';

const MODAL_LITERATURE = 'showModalLiterature';

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
        dataField: 'publication',
        text: 'Publication'
    }
];

class Publications extends Component {

    constructor(props) {
        super(props);

        this.state = {
            [MODAL_LITERATURE]: false,
            editId: 0
        }
    }

    showModal = (id) => {
        this.setState({
            [MODAL_LITERATURE]: true,
            editId: id
        });
    }

    hideModal = () => {
        this.props.onTableChange(undefined, { page: this.props.paginationOptions.page, sizePerPage: this.props.paginationOptions.sizePerPage, filters: {} });
        this.setState({ [MODAL_LITERATURE]: false });
    }

    formatResult = (data) => {

        return data.map(l => ({
            id: l.id,
            action: <Button bsSize='xsmall' bsStyle="warning" onClick={() => this.showModal(l.id)}>Edit</Button>,
            type: config.mappings.displayType[l.displayType].name,
            publication: helper.parsePublication({
                type: l.displayType,
                authors: l.paperAuthor,
                title: l.paperTitle,
                series: l.seriesSource,
                volume: l.volume,
                issue: l.issue,
                publisher: l.publisher,
                editor: l.editor,
                year: l.year,
                pages: l.pages,
                journal: l.journalName
            })
        }));
    }

    render() {
        return (
            <div id='publications'>
                <Grid id="functions">
                    <div id="functions">
                        <Button bsStyle="success" onClick={() => this.showModal('')}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                    </div>
                    <h2>Publications</h2>
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
                <PublicationModal id={this.state.editId} show={this.state[MODAL_LITERATURE]} onHide={this.hideModal} />
            </div>
        );
    }
}

export default TabledPage({
    getAll: config.uris.literaturesUri.getAllWFilterUri,
    getCount: config.uris.literaturesUri.countUri
})(Publications);
