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

import checklistFacade from '../../../facades/checklist';

import notifications from '../../../utils/notifications';
import helper from '../../../utils/helper';
import config from '../../../config/config';

const titleColWidth = 2;
const mainColWidth = 10;

const ChecklistDetailBody = ({
    species,
    listOfSpecies,
    fors: { basionymFor, replacedFor, nomenNovumFor },
    synonyms,
    onSpeciesInputChange,
    onSynonymsChange
}) => {

    if (!species || !species.id) {
        return null;
    }

    const handleSynonymAddRow = (selectedSpecies, synonymName, type) => {
        const specificSynonyms = synonyms[synonymName];
        const collection = addNewSynonymToList(selectedSpecies, species.id, specificSynonyms, type, listOfSpecies);
        synonyms[synonymName] = collection;
        onSynonymsChange(synonyms);
    };

    const handleSynonymRemoveRow = (rowId, synonymName) => {
        const specificSynonyms = synonyms[synonymName];

        const collection = specificSynonyms.filter((s, i) => i !== rowId);
        synonyms[synonymName] = collection;

        let deleteId = specificSynonyms[rowId].id;

        onSynonymsChange(synonyms, deleteId);
    };

    const handleSynonymTransition = (rowId, fromListName, toListName, newNumType) => {
        const fromList = [...synonyms[fromListName]];
        const toList = [...synonyms[toListName]];

        const selected = fromList[rowId];
        selected.syntype = newNumType;

        toList.push(selected);
        toList.sort(helper.synonymSorterLex);

        const fromListWithoutRemoved = fromList.filter((s, i) => i !== rowId);

        synonyms[fromListName] = fromListWithoutRemoved;
        synonyms[toListName] = toList;

        onSynonymsChange(synonyms);
    }

    const handleChangeMisidentificationAuthor = (rowId, value) => {
        const misidentifications = synonyms.misidentifications;
        misidentifications[rowId].misidentificationAuthor = value;

        synonyms.misidentifications = misidentifications;
        onSynonymsChange(synonyms);
    };

    const { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations, misidentifications } = synonyms;
    const listOfSpeciesOptions = listOfSpecies.map(l => ({
        id: l.id,
        label: helper.listOfSpeciesString(l)
    }));

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
                        onAddItemToList={selected => handleSynonymAddRow(selected, 'nomenclatoricSynonyms', config.mappings.synonym.nomenclatoric.numType)}
                        onRowDelete={id => handleSynonymRemoveRow(id, 'nomenclatoricSynonyms')}
                        itemComponent={NomenclatoricSynonymListItem}
                        // props specific to itemComponent
                        onChangeToTaxonomic={rowId => handleSynonymTransition(rowId, "nomenclatoricSynonyms", "taxonomicSynonyms", config.mappings.synonym.taxonomic.numType)}
                        onChangeToInvalid={rowId => handleSynonymTransition(rowId, "nomenclatoricSynonyms", "invalidDesignations", config.mappings.synonym.invalid.numType)}
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
                        onAddItemToList={selected => handleSynonymAddRow(selected, 'taxonomicSynonyms', config.mappings.synonym.taxonomic.numType)}
                        onRowDelete={id => handleSynonymRemoveRow(id, 'taxonomicSynonyms')}
                        itemComponent={TaxonomicSynonymListItem}
                        // props specific to itemComponent
                        onChangeToNomenclatoric={rowId => handleSynonymTransition(rowId, "taxonomicSynonyms", "nomenclatoricSynonyms", config.mappings.synonym.nomenclatoric.numType)}
                        onChangeToInvalid={rowId => handleSynonymTransition(rowId, "taxonomicSynonyms", "invalidDesignations", config.mappings.synonym.invalid.numType)}
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
                        onAddItemToList={selected => handleSynonymAddRow(selected, 'invalidDesignations', config.mappings.synonym.invalid.numType)}
                        onRowDelete={id => handleSynonymRemoveRow(id, 'invalidDesignations')}
                        itemComponent={InvalidSynonymListItem}
                        // props specific to itemComponent
                        onChangeToNomenclatoric={rowId => handleSynonymTransition(rowId, "invalidDesignations", "nomenclatoricSynonyms", config.mappings.synonym.nomenclatoric.numType)}
                        onChangeToTaxonomic={rowId => handleSynonymTransition(rowId, "invalidDesignations", "taxonomicSynonyms", config.mappings.synonym.taxonomic.numType)}
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
                        onAddItemToList={selected => handleSynonymAddRow(selected, 'misidentifications', config.mappings.synonym.misidentification.numType)}
                        onRowDelete={id => handleSynonymRemoveRow(id, 'misidentifications')}
                        itemComponent={MisidentifiedSynonymListItem}
                        // props specific to itemComponent
                        onChangeAuthor={handleChangeMisidentificationAuthor}
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

function addNewSynonymToList(selected, idParent, synonyms, type, listOfSpecies) {
    if (!selected) {
        return synonyms;
    }
    if (synonyms.find(s => s.synonym.id === selected.id)) {
        notifications.warning('The item already exists in the list');
        return synonyms;
    }

    const synonymObj = checklistFacade.createSynonym(idParent, selected.id, type);
    const species = listOfSpecies.find(l => l.id === selected.id);
    synonymObj.synonym = species;

    synonyms.push(synonymObj);
    synonyms.sort(helper.synonymSorterLex);
    return synonyms;
}

export default ChecklistDetailBody;