import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Col,
  Button, Checkbox,
  Modal, Panel,
  Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import checklistFacade from '../../../facades/checklist';

import config from '../../../config/config';

const titleColWidth = 2;
const mainColWidth = 10;

const initialValues = {
  id: undefined,
  ntype: 'A',
  hybrid: false,
  genus: '',
  species: '',
  subsp: '',
  var: '',
  subvar: '',
  forma: '',
  proles: '',
  unranked: '',
  authors: '',
  genusH: '',
  speciesH: '',
  subspH: '',
  varH: '',
  subvarH: '',
  formaH: '',
  authorsH: '',
  publication: '',
  tribus: ''
};

const ntypes = config.mappings.losType;

class SpeciesNameModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ...initialValues
    };
  }

  onEnter = async () => {
    const id = this.props.editId;
    if (id) {
      const accessToken = this.props.accessToken;
      const data = await checklistFacade.getSpeciesById({ id, accessToken });

      this.setState({ ...data });
    }
  }

  // at least one field must be non-empty - prevent accidental saving of all-empty
  getValidationState = () => {
    const { id, ntype, ...state } = this.state;
    for (const key in state) {  //without id and ntype
      if (state[key].length > 0) {
        return true;
      }
    }
    return false;
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleChangeCheckbox = (e) => {
    this.setState({ [e.target.id]: e.target.checked });
  }

  handleHide = () => {
    this.setState({
      ...initialValues
    });
    this.props.onHide();
  }

  handleSave = async () => {
    if (this.getValidationState()) {
      const accessToken = this.props.accessToken;
      const data = { ...this.state };
      await checklistFacade.saveSpecies({ data, accessToken });
      this.handleHide();
    } else {
      alert('At least one field must not be empty!');
    }
  }

  renderHybridFields = (isHybrid) => {
    if (isHybrid) {
      return (
        <Panel>
          <Panel.Body>
            <FormGroup controlId="genusH" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Genus
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.genusH || ''}
                  placeholder="Hybrid Genus"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="speciesH" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Species
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.speciesH || ''}
                  placeholder="Hybrid Species"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="subspH" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Subsp
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.subspH || ''}
                  placeholder="Hybrid Subsp"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="varH" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Var
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.varH || ''}
                  placeholder="Hybrid Var"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="subvarH" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Subvar
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.subvarH || ''}
                  placeholder="Hybrid Subvar"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="formaH" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Forma
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.formaH || ''}
                  placeholder="Hybrid Forma"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="authorsH" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Authors
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.authorsH || ''}
                  placeholder="Hybrid Authors"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
          </Panel.Body>
        </Panel>
      )
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.handleHide} onEnter={this.onEnter}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.editId ? 'Edit name' : 'Create new name'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId="ntype" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Type
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.ntype}
                  onChange={this.handleChange} >
                  {
                    Object.keys(ntypes).map(t => <option value={t} key={t}>{ntypes[t].text}</option>)
                  }
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup controlId="genus" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Genus
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.genus}
                  placeholder="Genus"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="species" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Species
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.species || ''}
                  placeholder="Species"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="subsp" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Subsp
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.subsp || ''}
                  placeholder="Subsp"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="var" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Var
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.var || ''}
                  placeholder="Var"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="subvar" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Subvar
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.subvar || ''}
                  placeholder="Subvar"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="forma" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Forma
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.forma || ''}
                  placeholder="Forma"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="proles" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Proles
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.proles || ''}
                  placeholder="Proles"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="unranked" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Unranked
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.unranked || ''}
                  placeholder="Unranked"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="authors" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Authors
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.authors || ''}
                  placeholder="Authors"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="hybrid">
              <Col sm={12}>
                <Checkbox inline
                  id="hybrid"
                  value={this.state.hybrid}
                  checked={this.state.hybrid}
                  onChange={this.handleChangeCheckbox}>Hybrid</Checkbox>
              </Col>
            </FormGroup>
            {
              this.renderHybridFields(this.state.hybrid)
            }
            <FormGroup controlId="publication" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Publication
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.publication || ''}
                  placeholder="Publication"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="tribus" bsSize='sm'>
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Tribus
                            </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={this.state.tribus || ''}
                  placeholder="Tribus"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHide}>Close</Button>
          <Button bsStyle="primary" onClick={this.handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(SpeciesNameModal);