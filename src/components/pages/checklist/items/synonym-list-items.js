import React from 'react';

import {
    Button, Glyphicon,
    ControlLabel, FormControl, FormGroup,
    Col
} from 'react-bootstrap';

import SynonymListItem from '../../../segments/SynonymListItem';

import config from '../../../../config/config';

const NomenclatoricSynonymListItem = ({ rowId, onChangeToTaxonomic, onChangeToInvalid, ...props }) => {
    const Additions = () => (
        <React.Fragment>
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => onChangeToTaxonomic(rowId)} title="Change to taxonomic synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.taxonomic.prefix}</Button>
            &nbsp;
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => onChangeToInvalid(rowId)} title="Change to invalid designation"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.invalid.prefix}</Button>
        </React.Fragment>
    );
    return (
        <SynonymListItem {...props} additions={Additions} />
    );
};

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

const InvalidSynonymListItem = ({ rowId, onChangeToNomenclatoric, onChangeToTaxonomic, ...props }) => {
    const Additions = p => (
        <React.Fragment>
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToNomenclatoric(rowId)} title="Change to nomenclatoric synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.nomenclatoric.prefix}</Button>
            &nbsp;
            <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToTaxonomic(rowId)} title="Change to taxonomic synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.taxonomic.prefix}</Button>
        </React.Fragment>
    );
    return (
        <SynonymListItem {...props} additions={Additions} />
    );
};

const MisidentifiedSynonymListItem = ({ rowId, misidentificationAuthors, onChangeAuthor, ...props }) => {
    return (
        <SynonymListItem showSubNomenclatoric={false} {...props}>
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

export default {
    NomenclatoricSynonymListItem,
    TaxonomicSynonymListItem,
    InvalidSynonymListItem,
    MisidentifiedSynonymListItem
};