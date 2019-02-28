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

const SynonymListItem = (props) => {

    return (
        <ListGroupItem bsSize='sm'>
            <Row>
                <Col xs={12}>
                    {props.data.prefix} <LosName data={props.data.value} />
                    <span className="pull-right">
                        <Button bsStyle="default" bsSize="xsmall" onClick={props.onRowChangeType}><Glyphicon glyph="share-alt" /> {props.changeTypeVal}</Button>
                        &nbsp;
                <Button bsStyle="danger" bsSize="xsmall" onClick={props.onRowDelete}><Glyphicon glyph="remove" /></Button>
                    </span>
                </Col>
            </Row>
            {constructSubNomenlatoric(props.data.value['synonyms-nomenclatoric'])}
        </ListGroupItem>
    );

}

export default SynonymListItem;