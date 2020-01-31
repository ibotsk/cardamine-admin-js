import React from 'react';

import {
    Well,
    ControlLabel, FormGroup,
    Col
} from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import AddableList from '../../segments/AddableList';
import SpeciesNamePlainList from './SpeciesNamePlainList';
import { NomenclatoricSynonymListItem, TaxonomicSynonymListItem, InvalidSynonymListItem, MisidentifiedSynonymListItem } from './items';

const titleColWidth = 2;
const mainColWidth = 10;

const ChecklistDetailBody = ({
    species,
    listOfSpeciesOptions,
    fors: { basionymFor, replacedFor, nomenNovumFor },
    synonyms: { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations, misidentifications },
    misidentificationAuthors,
    onSpeciesInputChange,
    onMisidentificationAuthorsChanged,
    onAddRow,
    onDeleteRow
}) => {

    if (!species || !species.id) {
        return null;
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
                        selected={getSelectedName(species.idAcceptedName, listOfSpeciesOptions)}
                        onChange={selected => handleChangeTypeAhead(selected, 'idAcceptedName', onSpeciesInputChange)}
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
                        selected={getSelectedName(species.idBasionym, listOfSpeciesOptions)}
                        onChange={selected => handleChangeTypeAhead(selected, 'idBasionym', onSpeciesInputChange)}
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
                        selected={getSelectedName(species.idReplaced, listOfSpeciesOptions)}
                        onChange={selected => handleChangeTypeAhead(selected, 'idReplaced', onSpeciesInputChange)}
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
                        selected={getSelectedName(species.idNomenNovum, listOfSpeciesOptions)}
                        onChange={selected => handleChangeTypeAhead(selected, 'idNomenNovum', onSpeciesInputChange)}
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
                        onAddItemToList={selected => handleAddNomenclatoric(selected, onAddRow)}
                        itemComponent={itemProps =>
                            <NomenclatoricSynonymListItem {...itemProps}
                                onRowDelete={id => handleRemoveNomenclatoric(id, onDeleteRow)}
                                onChangeToTaxonomic={id => handleChangeToTaxonomic(id, nomenclatoricSynonyms, onAddRow, onDeleteRow)}
                                onChangeToInvalid={id => handleChangeToInvalid(id, nomenclatoricSynonyms, onAddRow, onDeleteRow)}
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
                        onAddItemToList={selected => handleAddTaxonomic(selected, onAddRow)}
                        itemComponent={itemProps =>
                            <TaxonomicSynonymListItem {...itemProps}
                                onRowDelete={id => handleRemoveTaxonomic(id, onDeleteRow)}
                                onChangeToNomenclatoric={id => handleChangeToNomenclatoric(id, taxonomicSynonyms, onAddRow, onDeleteRow)}
                                onChangeToInvalid={id => handleChangeToInvalid(id, taxonomicSynonyms, onAddRow, onDeleteRow)}
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
                        onAddItemToList={selected => handleAddInvalidDesignation(selected, onAddRow)}
                        itemComponent={itemProps =>
                            <InvalidSynonymListItem {...itemProps}
                                onRowDelete={id => handleRemoveInvalidDesignation(id, onDeleteRow)}
                                onChangeToNomenclatoric={id => handleChangeToNomenclatoric(id, invalidDesignations, onAddRow, onDeleteRow)}
                                onChangeToTaxonomic={id => handleChangeToTaxonomic(id, invalidDesignations, onAddRow, onDeleteRow)}
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
                        onAddItemToList={selected => handleAddMisidentiication(selected, onAddRow)}
                        itemComponent={itemProps =>
                            <MisidentifiedSynonymListItem {...itemProps}
                                onRowDelete={id => handleRemoveMisidentification(id, onDeleteRow)}
                                misidentificationAuthors={misidentificationAuthors}
                                onChangeAuthor={onMisidentificationAuthorsChanged}
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
        </Well>
    );

};

function getSelectedName(id, options) {
    return options.filter(l => l.id === id);
}

function handleChangeTypeAhead(selected, prop, onInputChange) {
    const id = selected[0] ? selected[0].id : undefined;
    onInputChange(prop, id);
};

function handleAddNomenclatoric(selected, addFunc) { return addFunc(selected, 'nomenclatoricSynonyms', 'isNomenclatoricSynonymsChanged'); }
function handleAddTaxonomic(selected, addFunc) { return addFunc(selected, 'taxonomicSynonyms', 'isTaxonomicSynonymsChanged'); }
function handleAddInvalidDesignation(selected, addFunc) { return addFunc(selected, 'invalidDesignations', 'isInvalidDesignationsChanged'); }
function handleAddMisidentiication(selected, addFunc) { return addFunc(selected, 'misidentifications', 'isMisidentificationsChanged'); }

function handleRemoveNomenclatoric(id, removeFunc) { return removeFunc(id, 'nomenclatoricSynonyms', 'isNomenclatoricSynonymsChanged'); }
function handleRemoveTaxonomic(id, removeFunc) { return removeFunc(id, 'taxonomicSynonyms', 'isTaxonomicSynonymsChanged'); }
function handleRemoveInvalidDesignation(id, removeFunc) { return removeFunc(id, 'invalidDesignations', 'isInvalidDesignationsChanged'); }
function handleRemoveMisidentification(id, removeFunc) { return removeFunc(id, 'misidentifications', 'isMisidentificationsChanged'); }

function handleChangeToTaxonomic(id, fromList, addFunc, removeFunc) {
    const selected = fromList.find(s => s.id === id);
    handleAddTaxonomic(selected, addFunc);
    handleRemoveNomenclatoric(id, removeFunc);
    handleRemoveInvalidDesignation(id, removeFunc);
};

function handleChangeToNomenclatoric(id, fromList, addFunc, removeFunc) {
    const selected = fromList.find(s => s.id === id);
    handleAddNomenclatoric(selected, addFunc);
    handleRemoveTaxonomic(id, removeFunc);
    handleRemoveInvalidDesignation(id, removeFunc);
}

function handleChangeToInvalid(id, fromList, addFunc, removeFunc) {
    const selected = fromList.find(s => s.id === id);
    handleAddInvalidDesignation(selected, addFunc);
    handleRemoveNomenclatoric(id, removeFunc);
    handleRemoveTaxonomic(id, removeFunc);
}

export default ChecklistDetailBody;