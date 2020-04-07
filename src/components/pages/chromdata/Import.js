import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Col, Row,
  Button, Panel, Well,
} from 'react-bootstrap';

import CSVReader from 'react-csv-reader';
import { Line, Circle } from 'rc-progress';

import ImportReport from './ImportReport';
import { NotificationContainer } from 'react-notifications';

import importUtils from '../../../utils/import';
import notifications from '../../../utils/notifications';
import importFacade from '../../../facades/import';

const initialState = {
  submitEnabled: false,
  showImportProgress: false,
  records: [],
  loadDataCount: 0,
  loadDataPercent: 0,
  importDataPercent: 0,
  report: {},
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
      loadDataCount: i,
      loadDataPercent: newValue,
    });
  };

  increaseImport = (i) => {
    const { loadDataCount } = this.state;
    let newValue = Math.floor(i * 100 / loadDataCount);
    if (newValue > 100) {
      newValue = 100;
    }
    this.setState({
      importDataPercent: newValue,
    });
  }

  handleOnFileLoad = async (data) => {
    const { count, records } = await importFacade.loadData(data, this.props.accessToken, this.increase);

    // TODO: handle duplicate references found
    const report = importUtils.createReport(records);

    this.setState({
      submitEnabled: true,
      loadDataCount: count,
      report,
      records
    });
  };

  importRecords = async () => {
    const { records } = this.state;

    try {
      await importFacade.importData(records, this.props.accessToken, this.increaseImport);
      notifications.success("Data successfully imported");

      this.setState({
        ...initialState,
        importDataPercent: 100
      });
    } catch (e) {
      notifications.error('Error importing');
      throw e;
    }
  };

  handleCancel = () => this.setState({ ...initialState });

  render() {
    const {
      loadDataCount, loadDataPercent, report, importDataPercent,
    } = this.state;

    return (
      <div id="import">
        <Grid>
          <h2>Chromosome data import</h2>
          <Well>
            <ol>
              <li>Select CSV file to import</li>
              <li>Check Warnings and Info</li>
              <li>Click Import</li>
            </ol>
          </Well>
          <Panel>
            <Panel.Body>
              <CSVReader onFileLoaded={this.handleOnFileLoad} />
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Body>
              <Line percent={loadDataPercent} />
              <h4>Records to import: {loadDataCount}</h4>
              <ImportReport report={report} />
            </Panel.Body>
          </Panel>
          <Row>
            <Col sm={4} smOffset={4}>
              <div className="text-center">
                <h3>Importing: {importDataPercent} %</h3>
              </ div>
            </Col>
          </Row>
          <Row>
            <Col sm={2} smOffset={5}>
              <Circle percent={importDataPercent} strokeWidth={4} strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }} />
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <Button bsStyle='info' disabled={!this.state.submitEnabled} onClick={this.importRecords}>Import</Button>
            </Col>
            <Col sm={2} smOffset={8}>
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
