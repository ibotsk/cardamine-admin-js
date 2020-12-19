import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Col,
  Button, Modal,
  Form, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import { publicationsFacade } from '../../../../facades';

import config from '../../../../config';

const {
  mappings: {
    publication: {
      displayType: displayTypes,
      columnLabels,
    },
  },
} = config;

const titleColWidth = 2;
const mainColWidth = 10;

const intCols = ['displayType'];

const initialValues = {
  id: undefined,
  displayType: 1,
  paperAuthor: '',
  paperTitle: '',
  seriesSource: '',
  volume: '',
  issue: '',
  publisher: '',
  editor: '',
  year: '',
  pages: '',
  journalName: '',
  inputDate: '',
  note: '',
};

const createFieldsByDisplayType = (displayType, state, handleChange) => {
  const displayTypeColumns = displayTypes[displayType].columns;
  return displayTypeColumns.map((col) => (
    <FormGroup controlId={col} bsSize="sm">
      <Col componentClass={ControlLabel} sm={titleColWidth}>
        {columnLabels[col]}
      </Col>
      <Col sm={mainColWidth}>
        <FormControl
          type="text"
          value={state[col]}
          placeholder={columnLabels[col]}
          onChange={handleChange}
        />
      </Col>
    </FormGroup>
  ));
};

class PublicationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialValues,
    };
  }

  onEnter = async () => {
    const { id, accessToken } = this.props;
    if (id) {
      const data = await publicationsFacade.getPublicationByIdCurated(
        id, accessToken,
      );
      this.setState({ ...data });
    }
  }

  // at least one field must be non-empty - prevent accidental saving of all-empty
  getValidationState = () => {
    const { id, displayType, ...state } = this.state;
    for (const key of Object.keys(state)) { // without id, displayType
      if (state[key].length > 0) {
        return true; // 'success'
      }
    }
    return false; // 'error'
  }

  handleChange = (e) => {
    let val = e.target.value;
    if (intCols.includes(e.target.id)) {
      val = parseInt(e.target.value, 10);
    }
    this.setState({ [e.target.id]: val });
  }

  handleHide = () => {
    this.setState({
      ...initialValues,
    });
    const { onHide } = this.props;
    onHide();
  }

  handleSave = async () => {
    if (this.getValidationState()) {
      const { accessToken } = this.props;
      const data = { ...this.state };
      await publicationsFacade.savePublicationCurated(data, accessToken);
      this.handleHide();
    } else {
      // eslint-disable-next-line no-alert
      alert('At least one field must not be empty!');
    }
  }

  render() {
    const { show, id } = this.props;
    const {
      displayType,
    } = this.state;
    return (
      <Modal show={show} onHide={this.handleHide} onEnter={this.onEnter}>
        <Modal.Header closeButton>
          <Modal.Title>
            {id ? 'Edit publication' : 'Create new publication'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId="displayType" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Type
              </Col>
              <Col xs={mainColWidth}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  onChange={this.handleChange}
                  value={displayType}
                >
                  {
                    Object.keys(displayTypes).map((k) => (
                      <option value={k} key={k}>{displayTypes[k].name}</option>
                    ))
                  }
                </FormControl>
              </Col>
            </FormGroup>
            {
              createFieldsByDisplayType(
                displayType, this.state, this.handleChange,
              )
            }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHide}>Close</Button>
          <Button bsStyle="primary" onClick={this.handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(PublicationModal);

PublicationModal.propTypes = {
  id: PropTypes.number,
  show: PropTypes.bool.isRequired,
  accessToken: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

PublicationModal.defaultProps = {
  id: undefined,
};
