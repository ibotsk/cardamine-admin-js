import React from 'react';

import {
    Button, Glyphicon,
    ListGroupItem
} from 'react-bootstrap';

const SynonymListItem = (props) => {

    return (
        <ListGroupItem bsSize='sm'>
            {props.value}
            <span className="pull-right">
                <Button bsStyle="default" bsSize="xsmall" onClick={props.onRowChangeType}><Glyphicon glyph="share-alt" /> {props.changeTypeVal}</Button>
                &nbsp;
                <Button bsStyle="danger" bsSize="xsmall" onClick={props.onRowDelete}><Glyphicon glyph="remove" /></Button>
            </span>
        </ListGroupItem>
    );

}

export default SynonymListItem;