import React from 'react';

import { Button, Glyphicon } from 'react-bootstrap';

import SynonymListItem from '../../../segments/SynonymListItem';
import config from '../../../../config/config';

const TaxonomicSynonymListItem = ({ rowId, fromList, onChangeToNomenclatoric, onChangeToInvalid, ...props }) => {
    const Additions = p => (
        <React.Fragment>
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => onChangeToNomenclatoric(rowId)} title="Change to nomenclatoric synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.nomenclatoric.prefix}</Button>
            &nbsp;
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => onChangeToInvalid(rowId)} title="Change to invalid designation"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.invalid.prefix}</Button>
        </React.Fragment>
    );
    return (
        <SynonymListItem {...props} additions={Additions} />
    );
};

export default TaxonomicSynonymListItem;