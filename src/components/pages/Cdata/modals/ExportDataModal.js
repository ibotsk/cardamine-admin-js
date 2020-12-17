import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Modal, Button, Checkbox,
  Tabs, Tab,
  FormGroup, FormControl, ControlLabel,
  Row, Col,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import config from '../../../../config';
import { exportFacade } from '../../../../facades';
import { exportUtils } from '../../../../utils';

const {
  export: {
    chromdata: {
      columns: columnsConfig,
    },
    options: optionsConfig,
  },
} = config;

const CHECK_ALL = 'All';
const EXPORT_TYPE_CSV = 'CSV';

const defaultCheckedCheckboxes = (
  Object.keys(columnsConfig).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: columnsConfig[curr].default === true,
    }),
    {},
  )
);

const GroupCheckboxes = ({ checkboxesState, group, onChangeCheckbox }) => {
  const groupCols = Object.keys(columnsConfig)
    .filter((c) => columnsConfig[c].group === group);
  return groupCols.map((c) => (
    <Checkbox
      key={c}
      name={c}
      checked={checkboxesState[c]}
      value={c}
      onChange={onChangeCheckbox}
    >
      {columnsConfig[c].name}
    </Checkbox>
  ));
};

const ExportDataModal = ({
  show, onHide, ids, count,
}) => {
  const [exportType, setExportType] = useState(EXPORT_TYPE_CSV);
  const [delimiter, setDelimiter] = useState(optionsConfig.separator);

  const [checkboxes, setCheckboxes] = useState(defaultCheckedCheckboxes);
  const [exportData, setExportData] = useState([]);

  const accessToken = useSelector((state) => state.authentication.accessToken);

  const handleEnter = async () => {
    const exportIds = ids.includes('all') ? undefined : ids;
    const dataToExport = await exportFacade.getCdataForExport(
      exportIds, accessToken, exportUtils.cdata.transformRecord,
    );
    setExportData(dataToExport);
    setCheckboxes(defaultCheckedCheckboxes);
  };

  const handleHide = () => {
    onHide();
    setExportData([]);
  };

  const handleExport = async () => {
    const checkedFields = Object.keys(checkboxes)
      .filter((f) => checkboxes[f] === true);
    const headerColumns = exportUtils.cdata.csv.createHeaderColumns(
      checkedFields,
    );

    exportUtils.cdata.csv.createAndDownload(exportData, headerColumns, {
      delimiter,
    });
  };

  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    if (name === CHECK_ALL) {
      setCheckboxes((cbxs) => Object.keys(cbxs).reduce((prev, curr) => ({
        ...prev,
        [curr]: checked,
      }), {}));
    } else {
      setCheckboxes((cbxs) => ({
        ...cbxs,
        [name]: checked,
      }));
    }
  };

  const handleSetDefaultsFields = () => {
    setDelimiter(optionsConfig.separator);
  };

  // checked if all checkboxes are true -> no false value is found in values
  const isAllChecked = Object.values(checkboxes)
    .filter((el) => el === false).length === 0;

  return (
    <Modal
      id="export-data-modal"
      show={show}
      onEnter={handleEnter}
      onHide={handleHide}
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
            <Button
              bsSize="xsmall"
              bsStyle="primary"
              onClick={() => handleSetDefaultsFields()}
            >
              Reset
            </Button>
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Export format</ControlLabel>
              <FormControl
                componentClass="select"
                placeholder="type"
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
              >
                <option value={EXPORT_TYPE_CSV}>CSV</option>
              </FormControl>
            </FormGroup>
            <FormGroup controlId="separator " bsSize="sm">
              <ControlLabel>Separator</ControlLabel>
              <FormControl
                type="text"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                placeholder="Separator"
              />
            </FormGroup>
          </Tab>
          <Tab eventKey={2} title="Columns">
            <Row>
              <Col md={6}>
                <Button
                  bsSize="xsmall"
                  bsStyle="primary"
                  onClick={() => setCheckboxes(defaultCheckedCheckboxes)}
                >
                  Reset
                </Button>
                <Checkbox
                  name={CHECK_ALL}
                  checked={isAllChecked}
                  value={CHECK_ALL}
                  onChange={handleChangeCheckbox}
                >
                  All
                </Checkbox>

                <h6>Identification:</h6>
                <GroupCheckboxes
                  checkboxesState={checkboxes}
                  group="identification"
                  onChangeCheckbox={handleChangeCheckbox}
                />

                <h6>Publication:</h6>
                <GroupCheckboxes
                  checkboxesState={checkboxes}
                  group="publication"
                  onChangeCheckbox={handleChangeCheckbox}
                />

                <h6>Chromosomes data:</h6>
                <GroupCheckboxes
                  checkboxesState={checkboxes}
                  group="cdata"
                  onChangeCheckbox={handleChangeCheckbox}
                />
              </Col>
              <Col md={6}>
                <h6>Material:</h6>
                <GroupCheckboxes
                  checkboxesState={checkboxes}
                  group="material"
                  onChangeCheckbox={handleChangeCheckbox}
                />

                <h6>DNA data:</h6>
                <GroupCheckboxes
                  checkboxesState={checkboxes}
                  group="dna"
                  onChangeCheckbox={handleChangeCheckbox}
                />
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleHide}>Close</Button>
        <Button bsStyle="primary" onClick={handleExport}>Export</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportDataModal;

ExportDataModal.propTypes = {
  ids: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  count: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
