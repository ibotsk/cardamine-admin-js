import React from 'react';

import {
    Button, Glyphicon, Panel,
    ControlLabel, FormGroup, FormControl,
    Col
} from 'react-bootstrap';

import LosName from '../../segments/LosName';

import config from '../../../config/config';

const titleColWidth = 2;
const mainColWidth = 10;

const ntypes = config.mappings.losType;
const typifications = config.mappings.typifications;

const ChecklistDetailHeader = ({ data, onShowModal, onChangeInput }) => {

    return (
        <Panel id="species-edit-header">
            <Panel.Heading>
                <Button bsStyle='warning' bsSize='xsmall' onClick={onShowModal}>
                    <Glyphicon glyph='edit' /> Edit Name
                    </Button>
            </Panel.Heading>
            <Panel.Body>
                <h4><LosName data={data} /></h4>
                <h5>{data.publication || '-'}</h5>
                <hr />
                <FormGroup controlId='ntype' bsSize='sm'>
                    <Col componentClass={ControlLabel} sm={titleColWidth}>
                        Category
                        </Col>
                    <Col xs={3}>
                        <FormControl
                            componentClass="select"
                            placeholder="select"
                            value={data.ntype}
                            onChange={onChangeInput} >
                            {
                                Object.keys(ntypes).map(t => <option value={t} key={t}>{ntypes[t].text}</option>)
                            }
                        </FormControl>
                    </Col>
                </FormGroup>
                <hr />
                <FormGroup controlId='typification' bsSize='sm'>
                    <Col componentClass={ControlLabel} sm={titleColWidth}>
                        Type
                        </Col>
                    <Col xs={3}>
                        <FormControl
                            componentClass="select"
                            placeholder="typification"
                            value={this.state.species.typification || ""}
                            onChange={onChangeInput} >
                            <option value={""}>-</option>
                            {
                                Object.keys(typifications).map(t => <option value={t} key={t}>{typifications[t].text}</option>)
                            }
                        </FormControl>
                    </Col>
                </FormGroup>
                <FormGroup controlId="typeLocality" bsSize='sm'>
                    <Col componentClass={ControlLabel} sm={titleColWidth}>
                        Type Locality
                        </Col>
                    <Col sm={mainColWidth}>
                        <FormControl
                            type="text"
                            value={data.typeLocality || ""}
                            placeholder="Type Locality"
                            onChange={onChangeInput}
                            disabled={!data.typification}
                        />
                    </Col>
                </FormGroup>
            </Panel.Body>
        </Panel>
    );

};

export default ChecklistDetailHeader;