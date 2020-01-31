import React from 'react';

import {
    ControlLabel, FormControl, FormGroup,
    Col
} from 'react-bootstrap';

import SynonymListItem from '../../../segments/SynonymListItem';

import config from '../../../../config/config';

const MisidentifiedSynonymListItem = ({ rowId, misidentificationAuthors, onChangeAuthor, ...props }) => {
    return (
        <SynonymListItem rowId={rowId} showSubNomenclatoric={false} prefix={config.mappings.synonym.misidentification.prefix} {...props}>
            <FormGroup bsSize='sm'>
                <Col componentClass={ControlLabel} sm={2}>
                    Author:
                    </Col>
                <Col xs={8}>
                    <FormControl
                        type="text"
                        value={misidentificationAuthors[rowId] || ""}
                        placeholder="Misidentification Author"
                        onChange={e => onChangeAuthor(rowId, e.currentTarget.value)}
                    />
                </Col>
            </FormGroup>
        </SynonymListItem>
    );
};

export default MisidentifiedSynonymListItem;