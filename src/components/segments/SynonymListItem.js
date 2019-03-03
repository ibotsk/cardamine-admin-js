import React from 'react';

import {
    Col, Row,
    Button, Glyphicon,
    ListGroup, ListGroupItem
} from 'react-bootstrap';

import LosName from './LosName';

import config from '../../config/config';

const constructSubNomenlatoric = (subNomenclatoricList) => {
    if (!subNomenclatoricList || subNomenclatoricList.length === 0) {
        return null;
    }
    return (
        <ListGroup className="synonyms-sublist">
            {subNomenclatoricList.map(subNomen =>
                <ListGroupItem key={subNomen.id} bsSize='sm'>
                    <small>{config.mappings.synonym.nomenclatoric.prefix} <LosName data={subNomen} /></small>
                </ListGroupItem>)}
        </ListGroup>
    );
}

const SynonymListItem = ({ rowId, data: { prefix, value: losObject }, additions: Additions, ...props }) => {
    return (
        <ListGroupItem bsSize='sm'>
            <Row>
                <Col xs={12}>
                    {prefix} <LosName data={losObject} />
                    <span className="pull-right">
                        {Additions &&
                            <Additions rowId={rowId} {...props} />
                        }
                        <span className="remove-list-item">
                            <Button bsStyle="danger" bsSize="xsmall" onClick={() => props.onRowDelete(rowId)} title="Remove from this list"><Glyphicon glyph="remove" /></Button>
                        </span>
                    </span>
                </Col>
            </Row>
            {constructSubNomenlatoric(losObject['synonyms-nomenclatoric'])}
        </ListGroupItem>
    );

}

export default SynonymListItem;