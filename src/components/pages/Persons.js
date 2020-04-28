import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Grid, Glyphicon } from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import TabledPage from '../wrappers/TabledPageParent';
import PersonModal from '../segments/modals/PersonModal';

import config from '../../config/config';

const columns = [
  {
    dataField: 'id',
    text: 'ID',
  },
  {
    dataField: 'action',
    text: 'Actions',
  },
  {
    dataField: 'person',
    text: 'Person(s) Name',
  },
];

class Persons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModalPerson: false,
      editId: 0,
    };
  }

  showModal = (id) => {
    this.setState({
      showModalPerson: true,
      editId: id,
    });
  };

  hideModal = () => {
    const { paginationOptions, onTableChange } = this.props;
    onTableChange(undefined, {
      page: paginationOptions.page,
      sizePerPage: paginationOptions.sizePerPage,
      filters: {},
    });
    this.setState({ showModalPerson: false });
  };

  formatResult = (data) => data.map((p) => ({
    id: p.id,
    action: (
      <Button
        bsSize="xsmall"
        bsStyle="warning"
        onClick={() => this.showModal(p.id)}
      >
        Edit
      </Button>
    ),
    person: p.persName,
  }));

  render() {
    const { data, onTableChange, paginationOptions } = this.props;
    const { editId, showModalPerson } = this.state;
    return (
      <div id="persons">
        <Grid id="functions">
          <div id="functions">
            <Button bsStyle="success" onClick={() => this.showModal('')}>
              <Glyphicon glyph="plus" />
              {' '}
              Add new
            </Button>
          </div>
          <h2>Persons</h2>
        </Grid>
        <Grid fluid>
          <BootstrapTable
            hover
            striped
            condensed
            remote={{ filter: true, pagination: true }}
            keyField="id"
            data={this.formatResult(data)}
            columns={columns}
            filter={filterFactory()}
            onTableChange={onTableChange}
            pagination={paginationFactory(paginationOptions)}
          />
        </Grid>
        <PersonModal
          id={editId}
          show={showModalPerson}
          onHide={this.hideModal}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(
  TabledPage({
    getAll: config.uris.personsUri.getAllWFilterUri,
    getCount: config.uris.personsUri.countUri,
  })(Persons),
);
