import React from 'react';

import {
    ControlLabel, FormControl, FormGroup,
    Col
} from 'react-bootstrap';

import SynonymListItem from '../../../segments/SynonymListItem';

import config from '../../../../config/config';

const MisidentifiedSynonymListItem = ({ rowId, onChangeAuthor, ...props }) => {
    return (
        <SynonymListItem rowId={rowId} showSubNomenclatoric={false} prefix={config.mappings.synonym.misidentification.prefix} {...props}>
            <FormGroup bsSize='sm'>
                <Col componentClass={ControlLabel} sm={2}>
                    Author:
                </Col>
                <Col xs={8}>
                    <FormControl
                        type="text"
                        value={props.data.misidentificationAuthor || ""}
                        placeholder="Misidentification Author"
                        onChange={e => onChangeAuthor(rowId, e.target.value)}
                    />
                </Col>
            </FormGroup>
        </SynonymListItem>
    );
};

export default MisidentifiedSynonymListItem;