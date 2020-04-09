import React from 'react';

import {
  Button,
  Glyphicon,
  Panel,
  ControlLabel,
  FormGroup,
  FormControl,
  Col,
} from 'react-bootstrap';

import LosName from '../../segments/LosName';

import config from '../../../config/config';

const titleColWidth = 2;
const mainColWidth = 10;

const ntypes = config.mappings.losType;
const { typifications } = config.mappings;

const ChecklistDetailHeader = ({
  data,
  onShowEditModal,
  onShowDeleteModal,
  onChangeInput,
}) => {
  return (
    <Panel id="species-edit-header">
      <Panel.Heading>
        <Button bsStyle="warning" bsSize="xsmall" onClick={onShowEditModal}>
          <Glyphicon glyph="edit" /> Edit Name
        </Button>
        <Button
          bsStyle="danger"
          bsSize="xsmall"
          onClick={onShowDeleteModal}
          className="pull-right"
        >
          <Glyphicon glyph="trash" /> Delete Name
        </Button>
      </Panel.Heading>
      <Panel.Body>
        <h4>
          <LosName data={data} />
        </h4>
        <h5>{data.publication || '-'}</h5>
        <hr />
        <FormGroup controlId="ntype" bsSize="sm">
          <Col componentClass={ControlLabel} sm={titleColWidth}>
            Category
          </Col>
          <Col xs={3}>
            <FormControl
              componentClass="select"
              placeholder="select"
              value={data.ntype}
              onChange={(e) => onChangeInput(e.target.id, e.target.value)}
            >
              {Object.keys(ntypes).map((t) => (
                <option value={t} key={t}>
                  {ntypes[t].text}
                </option>
              ))}
            </FormControl>
          </Col>
        </FormGroup>
        <hr />
        <FormGroup controlId="typification" bsSize="sm">
          <Col componentClass={ControlLabel} sm={titleColWidth}>
            Type
          </Col>
          <Col xs={3}>
            <FormControl
              componentClass="select"
              placeholder="typification"
              value={data.typification || ''}
              onChange={(e) => onChangeInput(e.target.id, e.target.value)}
            >
              <option value="">-</option>
              {Object.keys(typifications).map((t) => (
                <option value={t} key={t}>
                  {typifications[t].text}
                </option>
              ))}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="typeLocality" bsSize="sm">
          <Col componentClass={ControlLabel} sm={titleColWidth}>
            Type specimen / Illustration
          </Col>
          <Col sm={mainColWidth}>
            <FormControl
              type="text"
              value={data.typeLocality || ''}
              placeholder="Type Specimen / Illustration"
              onChange={(e) => onChangeInput(e.target.id, e.target.value)}
              disabled={!data.typification}
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="referenceToTypeDesignation" bsSize="sm">
          <Col componentClass={ControlLabel} sm={titleColWidth}>
            Reference to the type designation
          </Col>
          <Col sm={mainColWidth}>
            <FormControl
              componentClass="textarea"
              value={data.referenceToTypeDesignation || ''}
              placeholder="Reference to the type designation"
              onChange={(e) => onChangeInput(e.target.id, e.target.value)}
              disabled={!data.typification}
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="indLoc" bsSize="sm">
          <Col componentClass={ControlLabel} sm={titleColWidth}>
            Ind. loc. (from the protologue)
          </Col>
          <Col sm={mainColWidth}>
            <FormControl
              componentClass="textarea"
              value={data.indLoc || ''}
              placeholder="Ind. loc."
              onChange={(e) => onChangeInput(e.target.id, e.target.value)}
            />
          </Col>
        </FormGroup>
      </Panel.Body>
    </Panel>
  );
};

export default ChecklistDetailHeader;
