import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Col, Row,
  Button, Panel
} from 'react-bootstrap';

import CSVReader from 'react-csv-reader';
import { Line } from 'rc-progress';

import ImportReport from './ImportReport';
import { NotificationContainer } from 'react-notifications';

import importUtils from '../../../utils/import';
import notifications from '../../../utils/notifications';
import importFacade from '../../../facades/import';

const initialState = {
  submitEnabled: false,
  showImportProgress: false,
  records: [],
  recordsCount: 0,
  report: {},
  loadDataPercent: 0
};

class Import extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ...initialState
    };
  }

  increase = (i, total) => {
    let newValue = Math.floor(i * 100 / total);

    if (newValue > 100) {
      newValue = 100;
    }
    this.setState({
      recordsCount: i,
      loadDataPercent: newValue
    });
  };

  handleOnFileLoad = async (data) => {
    const { count, records } = await importFacade.loadData(data, this.props.accessToken, this.increase);

    // TODO: handle duplicate references found
    const report = importUtils.createReport(records);

    this.setState({
      submitEnabled: true,
      recordsCount: count,
      report,
      records
    });
  };

  importRecords = async () => {
    const records = this.state.records;

    try {
      await importFacade.importData(records, this.props.accessToken);
      notifications.success("Data successfully imported");

      this.setState({
        ...initialState
      });
    } catch (e) {
      notifications.error('Error importing');
      throw e;
    }
  };

  handleCancel = () => this.setState({ ...initialState });

  render() {
    return (
      <div id="import">
        <Grid>
          <Panel>
            <Panel.Body>
              <CSVReader onFileLoaded={this.handleOnFileLoad} />
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Body>
              <Line percent={this.state.loadDataPercent} />
              <h4>Records to import: {this.state.recordsCount}</h4>

              <ImportReport report={this.state.report} />
            </Panel.Body>
          </Panel>
          <Row>
            <Col sm={5} smOffset={2}>
              <Button bsStyle='info' disabled={!this.state.submitEnabled} onClick={this.importRecords}>Import</Button>
            </Col>
            <Col sm={5}>
              <Button bsStyle="default" onClick={this.handleCancel} >Start over</Button>
            </Col>
          </Row>
        </Grid>
        <NotificationContainer />
      </div>
    );
  }

};

const mapStateToProps = state => ({
  accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(Import);
