import React, { Component } from 'react';

import { Button, Grid, Glyphicon } from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import PropTypes from 'prop-types';
import PublicationType from '../propTypes/publication';

import TabledPage from '../wrappers/TabledPageParent';
import PublicationModal from '../segments/modals/PublicationModal';

import helper from '../../utils/helper';
import config from '../../config/config';

// const showModalLiterature = 'showModalLiterature';

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
    dataField: 'type',
    text: 'Type',
  },
  {
    dataField: 'publication',
    text: 'Publication',
  },
];

class Publications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModalLiterature: false,
      editId: 0,
    };
  }

  showModal = (id) => {
    this.setState({
      showModalLiterature: true,
      editId: id,
    });
  };

  hideModal = async () => {
    const { paginationOptions, onTableChange } = this.props;
    const { page, sizePerPage } = paginationOptions;
    await onTableChange(undefined, {
      page,
      sizePerPage,
      filters: {},
    });
    this.setState({ showModalLiterature: false });
  };

  formatResult = (data) => data.map((l) => ({
    id: l.id,
    action: (
      <Button
        bsSize="xsmall"
        bsStyle="warning"
        onClick={() => this.showModal(l.id)}
      >
        Edit
      </Button>
    ),
    type: config.mappings.displayType[l.displayType].name,
    publication: helper.parsePublication(l),
  }));

  render() {
    const { data, onTableChange, paginationOptions } = this.props;
    const { editId, showModalLiterature } = this.state;
    return (
      <div id="publications">
        <Grid id="functions">
          <div id="functions">
            <Button bsStyle="success" onClick={() => this.showModal('')}>
              <Glyphicon glyph="plus" />
              {' '}
              Add new
            </Button>
          </div>
          <h2>Publications</h2>
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
        <PublicationModal
          id={editId}
          show={showModalLiterature}
          onHide={this.hideModal}
        />
      </div>
    );
  }
}

export default TabledPage({
  getAll: config.uris.literaturesUri.getAllWFilterUri,
  getCount: config.uris.literaturesUri.countUri,
})(Publications);

Publications.propTypes = {
  data: PropTypes.arrayOf(PublicationType.type).isRequired,
  paginationOptions: PropTypes.shape({
    page: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
  }).isRequired,
  onTableChange: PropTypes.func.isRequired,
};

Publications.defaultProps = {
  ...PublicationType.defaults,
};
