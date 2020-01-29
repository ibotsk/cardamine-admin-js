import React from 'react';

import {
    Button,
    Panel, Form, Well
} from 'react-bootstrap';

import checklistFacade from '../../../facades/checklist';

import notifications from '../../../utils/notifications';
import helper from '../../../utils/helper';

import ChecklistDetailHeader from './ChecklistDetailHeader';
import ChecklistDetailBody from './ChecklistDetailBody';

const ChecklistDetail = ({ species, fors, synonyms, synonymIdsToDelete, listOfSpecies, accessToken, onShowModal, onValueChange, onDetailsChanged, ...props }) => {

    const submitForm = async e => {
        e.preventDefault();
        submit(species, synonyms, accessToken);
        onDetailsChanged();
    };

    const handleSpeciesChange = (prop, val) => {
        const updatedSpecies = { ...species, [prop]: val };
        onValueChange({ species: updatedSpecies });
    };

    const handleSynonymAddRow = (selected, property, type) => {
        const specificSynonyms = synonyms[property];

        const collection = addSynonymToList(selected, species.id, specificSynonyms, type, listOfSpecies);

        synonyms[property] = collection;
        onValueChange({ synonyms });
    };

    const handleSynonymRemoveRow = (id, property) => {
        const specificSynonyms = synonyms[property];

        const collection = specificSynonyms.filter((s, i) => i !== id);
        synonyms[property] = collection;

        const deleteId = specificSynonyms[id].id;

        const synonymsToDelete = synonymIdsToDelete;
        if (deleteId) {
            synonymsToDelete.push(deleteId);
        }

        onValueChange({
            synonyms,
            synonymIdsToDelete: synonymsToDelete
        });
    };

    const handleChangeMisidentificationAuthor = (rowId, value) => {
        const misidentifications = synonyms.misidentifications;
        misidentifications[rowId].misidentificationAuthor = value;

        synonyms.misidentifications = misidentifications;
        onValueChange({ synonyms });
    };

    if (!species.id) {
        return (
            <Panel>
                <Panel.Body>Click row to edit details</Panel.Body>
            </Panel>
        );
    }
    const listOfSpeciesOptions = listOfSpecies.map(l => ({
        id: l.id,
        label: helper.listOfSpeciesString(l)
    }));

    return (
        <React.Fragment>
            <Form onSubmit={submitForm} horizontal>
                <ChecklistDetailHeader
                    data={species}
                    onShowModal={onShowModal}
                    onChangeInput={handleSpeciesChange}
                />
                <ChecklistDetailBody
                    species={species}
                    listOfSpeciesOptions={listOfSpeciesOptions}
                    fors={fors}
                    synonyms={synonyms}
                    onMisidentificationAuthorsChanged={handleChangeMisidentificationAuthor}
                    onSpeciesInputChange={handleSpeciesChange}
                    onAddRow={handleSynonymAddRow}
                    onDeleteRow={handleSynonymRemoveRow}
                />
                <Well>
                    <Button bsStyle="primary" type='submit' >Save</Button>
                </Well>
            </Form>
        </React.Fragment>
    );

};

async function submit(species, synonyms, accessToken) {
    const { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations, misidentifications } = synonyms;

    try {
        await checklistFacade.saveSpeciesAndSynonyms({
            species,
            accessToken,
            nomenclatoricSynonyms,
            taxonomicSynonyms,
            invalidDesignations,
            misidentifications
        });

        notifications.success('Saved');
    } catch (error) {
        notifications.error('Error saving');
        throw error;
    }
};

function addSynonymToList(selected, idParent, synonyms, type, listOfSpecies) {
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
    synonyms.sort(helper.listOfSpeciesSorterLex);
    return synonyms;
}

export default ChecklistDetail;
