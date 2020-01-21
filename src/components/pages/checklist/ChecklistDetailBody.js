import React from 'react';

import {
    Button, Well,
    ControlLabel, FormGroup,
    Col
} from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import AddableList from '../../segments/AddableList';
import SpeciesNamePlainList from './SpeciesNamePlainList';
import { NomenclatoricSynonymListItem, TaxonomicSynonymListItem, InvalidSynonymListItem, MisidentifiedSynonymListItem } from './items/synonym-list-items';

const titleColWidth = 2;
const mainColWidth = 10;

const ChecklistDetailBody = ({
    species,
    listOfSpeciesOptions,
    fors: { basionymFor, replacedFor, nomenNovumFor },
    synonyms: { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations, misidentifications },
    misidentificationAuthors,
    onSpeciesInputChange,
    onAddRow,
    onDeleteRow
}) => {

    const handleChangeTypeAhead = (selected, prop) => {
        const id = selected[0] ? selected[0].id : undefined;
        onSpeciesInputChange(prop, id);
    };

    const getSelectedName = id => listOfSpeciesOptions.filter(l => l.id === id);

    if (!species || !species.id) {
        return undefined;
    }

    return (
        <Well id="species-edit-references">
            <FormGroup controlId="accepted-name-autocomplete" bsSize='sm'>
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Accepted name
                </Col>
                <Col xs={mainColWidth}>
                    <Typeahead
                        id="accepted-name-autocomplete"
                        options={listOfSpeciesOptions}
                        selected={getSelectedName(species.idAcceptedName)}
                        onChange={selected => handleChangeTypeAhead(selected, 'idAcceptedName')}
                        placeholder="Start by typing a species present in the database" />
                </Col>
            </FormGroup>
            <FormGroup controlId="basionym-autocomplete" bsSize='sm'>
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Basionym
                </Col>
                <Col xs={mainColWidth}>
                    <Typeahead
                        id="basionym-autocomplete"
                        options={listOfSpeciesOptions}
                        selected={getSelectedName(species.idBasionym)}
                        onChange={selected => handleChangeTypeAhead(selected, 'idBasionym')}
                        placeholder="Start by typing a species present in the database" />
                </Col>
            </FormGroup>
            <FormGroup controlId="replaced-autocomplete" bsSize='sm'>
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Replaced Name
                </Col>
                <Col xs={mainColWidth}>
                    <Typeahead
                        id="replaced-autocomplete"
                        options={listOfSpeciesOptions}
                        selected={getSelectedName(species.idReplaced)}
                        onChange={selected => handleChangeTypeAhead(selected, 'idReplaced')}
                        placeholder="Start by typing a species present in the database" />
                </Col>
            </FormGroup>
            <FormGroup controlId="nomen-novum-autocomplete" bsSize='sm'>
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Nomen Novum
                </Col>
                <Col xs={mainColWidth}>
                    <Typeahead
                        id="nomen-novum-autocomplete"
                        options={listOfSpeciesOptions}
                        selected={getSelectedName(species.idNomenNovum)}
                        onChange={selected => handleChangeTypeAhead(selected, 'idNomenNovum')}
                        placeholder="Start by typing a species present in the database" />
                </Col>
            </FormGroup>
            <hr />
            <FormGroup controlId="nomenclatoric-synonyms-autocomplete" bsSize='sm'>
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Nomenclatoric Synonyms
                </Col>
                <Col xs={mainColWidth}>
                    <AddableList
                        id="nomenclatoric-synonyms-autocomplete"
                        data={nomenclatoricSynonyms}
                        options={listOfSpeciesOptions}
                        onAddItemToList={selected => onAddRow(selected, 'nomenclatoricSynonyms', 'isNomenclatoricSynonymsChanged')}
                        itemComponent={itemProps => <NomenclatoricSynonymListItem {...itemProps}
                            onRowDelete={id => onDeleteRow(id, 'nomenclatoricSynonyms', 'isNomenclatoricSynonymsChanged')}
                            onChangeToTaxonomic={() => console.log('change to taxonomic')}
                            onChangeToInvalid={() => console.log('change to invalid')}
                        />}
                    />
                </Col>
            </FormGroup>
            <FormGroup controlId="taxonomic-synonyms-autocomplete" bsSize='sm'>
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Taxonomic Synonyms
                </Col>
                <Col xs={mainColWidth}>
                    <AddableList
                        id="taxonomic-synonyms-autocomplete"
                        data={taxonomicSynonyms}
                        options={listOfSpeciesOptions}
                        onAddItemToList={selected => onAddRow(selected, 'taxonomicSynonyms', 'isTaxonomicSynonymsChanged')}
                        itemComponent={itemProps => <TaxonomicSynonymListItem {...itemProps}
                            onRowDelete={id => onDeleteRow(id, 'taxonomicSynonyms', 'isTaxonomicSynonymsChanged')}
                            onChangeToNomenclatoric={() => console.log('change to nomenclatoric')}
                            onChangeToInvalid={() => console.log('change to invalid')}
                        />}
                    />
                </Col>
            </FormGroup>
            <FormGroup controlId="invalid-designations-autocomplete" bsSize='sm'>
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Invalid Designations
                </Col>
                <Col xs={mainColWidth}>
                    <AddableList
                        id="invalid-designations-autocomplete"
                        data={invalidDesignations}
                        options={listOfSpeciesOptions}
                        onAddItemToList={selected => onAddRow(selected, 'invalidDesignations', 'isInvalidDesignationsChanged')}
                        itemComponent={itemProps => <InvalidSynonymListItem {...itemProps}
                            onRowDelete={id => onDeleteRow(id, 'invalidDesignations', 'isInvalidDesignationsChanged')}
                            onChangeToNomenclatoric={() => console.log('change to nomenclatoric')}
                            onChangeToTaxonomic={() => console.log('change to taxonomic')}
                        />}
                    />
                </Col>
            </FormGroup>
            <FormGroup controlId="misidentifications-autocomplete" bsSize='sm'>
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Misidentifications
                </Col>
                <Col xs={mainColWidth}>
                    <AddableList
                        id="misidentifications-autocomplete"
                        data={misidentifications}
                        options={listOfSpeciesOptions}
                        onAddItemToList={selected => onAddRow(selected, 'misidentifications', 'isMisidentificationsChanged')}
                        itemComponent={itemProps => <MisidentifiedSynonymListItem {...itemProps}
                            onRowDelete={id => onDeleteRow(id, 'misidentifications', 'isMisidentificationsChanged')}
                            misidentificationAuthors={misidentificationAuthors}
                            onChangeAuthor={() => console.log('change misidentification author')}
                        />}
                    />
                </Col>
            </FormGroup>
            <hr />
            <FormGroup controlId="basionym-for">
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Basionym For
                </Col>
                <Col xs={mainColWidth}>
                    <SpeciesNamePlainList list={basionymFor} />
                </Col>
            </FormGroup>
            <FormGroup controlId="replaced-for">
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Replaced For
                </Col>
                <Col xs={mainColWidth}>
                    <SpeciesNamePlainList list={replacedFor} />
                </Col>
            </FormGroup>
            <FormGroup controlId="nomen-novum-for">
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                    Nomen Novum For
                </Col>
                <Col xs={mainColWidth}>
                    <SpeciesNamePlainList list={nomenNovumFor} />
                </Col>
            </FormGroup>
            <hr />
            <Button bsStyle="primary" type='submit' >Save</Button>
        </Well>
    );

};

export default ChecklistDetailBody;