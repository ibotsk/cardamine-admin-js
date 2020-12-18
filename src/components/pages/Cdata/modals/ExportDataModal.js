import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Modal, Button, Checkbox,
  Tabs, Tab,
  FormGroup, FormControl, ControlLabel,
  Row, Col, Panel,
} from 'react-bootstrap';

import { BeatLoader } from 'react-spinners';

import PropTypes from 'prop-types';

import commonHooks from '../../../segments/hooks';
import { exportFacade } from '../../../../facades';
import { exportUtils } from '../../../../utils';
import config from '../../../../config';

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

const LoadDataInfo = ({ isLoading, loadedCount }) => {
  if (isLoading) {
    return (
      <div className="text-center">
        <div>Loading data</div>
        <BeatLoader loading={isLoading} color="#50E3C2" />
      </div>
    );
  }
  return (
    <div>
      {loadedCount}
      {' '}
      records ready
    </div>
  );
};

const ExportDataModal = ({
  show, onHide, ids,
}) => {
  const [exportType, setExportType] = useState(EXPORT_TYPE_CSV);
  const [delimiter, setDelimiter] = useState(optionsConfig.separator);

  const [checkboxes, setCheckboxes] = useState(defaultCheckedCheckboxes);
  const accessToken = useSelector((state) => state.authentication.accessToken);


  const getCdata = () => {
    const exportIds = ids.includes('all') ? undefined : ids;
    return exportFacade.getCdataForExport(
      exportIds, accessToken, exportUtils.cdata.transformRecord,
    );
  };
  const { data, isLoading, doFetch } = commonHooks.useSimpleFetch(getCdata);

  const handleEnter = async () => {
    doFetch();
    setCheckboxes(defaultCheckedCheckboxes);
  };

  const handleHide = () => {
    onHide();
    // not resetting data for caching reasons
    // setData([]);
  };

  const handleExport = async () => {
    const checkedFields = Object.keys(checkboxes)
      .filter((f) => checkboxes[f] === true);
    const headerColumns = exportUtils.cdata.csv.createHeaderColumns(
      checkedFields,
    );

    exportUtils.cdata.csv.createAndDownload(data, headerColumns, {
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
          Export data
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Panel>
          <Panel.Body>
            <LoadDataInfo isLoading={isLoading} loadedCount={data.length} />
          </Panel.Body>
        </Panel>
        <Tabs defaultActiveKey={1} id="export-tabs">
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
        <Button
          bsStyle="primary"
          onClick={handleExport}
          disabled={data.length < 1}
        >
          Export
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportDataModal;

ExportDataModal.propTypes = {
  ids: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

LoadDataInfo.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  loadedCount: PropTypes.number.isRequired,
};
