import React from 'react';
import {
  Modal, Button, Checkbox,
  Tabs, Tab,
  FormGroup, FormControl, ControlLabel,
  Row, Col,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import { CSVDownload } from 'react-csv';

import config from '../../../config';
import { exportFacade } from '../../../facades';
import { exportUtils } from '../../../utils';

const { export: exportConfig } = config;

const CHECK_ALL = 'All';
const EXPORT_CHROMDATA = 'chromdata';

const makeCheckedDefaultCheckboxes = (which) => {
  const cols = exportConfig[which];
  return Object.keys(cols).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: cols[curr].default === true,
    }),
    {},
  );
};

const initialState = {
  exportFormat: ['CSV'],
  filename: 'chromdata_export.csv',
  separator: exportConfig.options.separator,
  enclosingCharacter: exportConfig.options.enclosingCharacter,
  chromdata: makeCheckedDefaultCheckboxes(EXPORT_CHROMDATA), // checkboxes
  checkedAll: false,
  exportData: [],
  exportHeaders: [],
};

class ExportDataModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
    };
  }

  handleHide = () => {
    this.setState({ ...initialState });
    const { onHide } = this.props;
    onHide();
  }

  handleExport = async () => {
    const { type: which, ids, accessToken } = this.props;
    const dataToExport = await exportFacade.getForExport(ids, accessToken);
    // eslint-disable-next-line react/destructuring-assignment
    const fields = this.state[which];
    const checkedFields = Object.keys(fields).filter((f) => fields[f] === true);
    const exportconfigWhich = exportConfig[which];

    const { data: exportData, headers: exportHeaders } = exportUtils
      .createCsvData(dataToExport, checkedFields, exportconfigWhich);

    this.setState({
      exportData,
      exportHeaders,
    });
  }

  onChangeTextInput = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  onChangeCheckbox = (e, which) => {
    const targetName = e.target.name;
    const targetChecked = e.target.checked;

    // eslint-disable-next-line react/destructuring-assignment
    const checkboxesToChooseFromState = this.state[which];
    const checkboxesToChooseFrom = { ...checkboxesToChooseFromState };
    let { checkedAll } = this.state;

    if (targetName === CHECK_ALL) {
      if (targetChecked) {
        Object.keys(checkboxesToChooseFrom)
          .forEach((k) => { checkboxesToChooseFrom[k] = true; });
      } else {
        Object.keys(checkboxesToChooseFrom)
          .forEach((k) => { checkboxesToChooseFrom[k] = false; });
      }
      checkedAll = targetChecked;
    } else {
      checkboxesToChooseFrom[targetName] = targetChecked;
    }

    this.setState({
      [which]: checkboxesToChooseFrom,
      checkedAll,
    });
  }

  makeCheckboxes = (which, subwhich) => {
    // eslint-disable-next-line react/destructuring-assignment
    const stateWhich = this.state[which];
    const configCols = exportConfig[which];
    const relevantCols = Object.keys(configCols)
      .filter((c) => configCols[c].group === subwhich);
    return relevantCols.map((c) => (
      <Checkbox
        key={c}
        name={c}
        checked={stateWhich[c]}
        value={c}
        onChange={(e) => this.onChangeCheckbox(e, which)}
      >
        {configCols[c].name}
      </Checkbox>
    ));
  }

  render() {
    const { show, count } = this.props;
    const {
      exportFormat,
      exportData,
      exportHeaders,
      filename,
      separator,
      enclosingCharacter,
      checkedAll,
    } = this.state;
    return (
      <Modal
        id="export-data-modal"
        show={show}
        onHide={this.handleHide}
        onEnter={this.handleEnter}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Export data -
            {' '}
            {count || 0}
            {' '}
            records to export
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey={1} id="export-tabs" className="">
            <Tab eventKey={1} title="File">
              <FormGroup controlId="formControlsSelect">
                <ControlLabel>Export format</ControlLabel>
                <FormControl componentClass="select">
                  {exportFormat.map((v, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={i} value={v}>{v}</option>
                  ))}
                </FormControl>
              </FormGroup>
              <FormGroup controlId="filename" bsSize="sm">
                <ControlLabel>File name</ControlLabel>
                <FormControl
                  type="text"
                  value={filename}
                  onChange={this.onChangeTextInput}
                  placeholder="Filename"
                />
              </FormGroup>
              <FormGroup controlId="separator " bsSize="sm">
                <ControlLabel>Separator</ControlLabel>
                <FormControl
                  type="text"
                  value={separator}
                  onChange={this.onChangeTextInput}
                  placeholder="Separator"
                />
              </FormGroup>
              <FormGroup controlId="enclosingCharacter" bsSize="sm">
                <ControlLabel>Enclosing Character</ControlLabel>
                <FormControl
                  type="text"
                  value={enclosingCharacter}
                  onChange={this.onChangeTextInput}
                  placeholder="Enclosing character"
                />
              </FormGroup>
            </Tab>
            <Tab eventKey={2} title="Columns">
              <Row>
                <Col md={6}>
                  <Checkbox
                    name={CHECK_ALL}
                    checked={checkedAll}
                    value={CHECK_ALL}
                    onChange={(e) => this.onChangeCheckbox(e, 'chromdata')}
                  >
                    All
                  </Checkbox>

                  <h6>Identification:</h6>
                  {this.makeCheckboxes('chromdata', 'identification')}

                  <h6>Publication:</h6>
                  {this.makeCheckboxes('chromdata', 'publication')}

                  <h6>Chromosomes data:</h6>
                  {this.makeCheckboxes('chromdata', 'cdata')}
                </Col>
                <Col md={6}>
                  <h6>Material:</h6>
                  {this.makeCheckboxes('chromdata', 'material')}
                  <h6>DNA data:</h6>
                  {this.makeCheckboxes('chromdata', 'dna')}
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHide}>Close</Button>
          {
            exportData.length > 0
            && (
            <CSVDownload
              headers={exportHeaders}
              data={exportData}
              filename={filename}
              separator={separator}
              enclosingCharacter={enclosingCharacter}
              target="_self"
            />
            )
          }
          <Button bsStyle="primary" onClick={this.handleExport}>Export</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ExportDataModal;

ExportDataModal.propTypes = {
  type: PropTypes.string.isRequired,
  ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  count: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  accessToken: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};
