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

const ChecklistDetail = ({ species, fors, synonyms, listOfSpecies, accessToken, onShowModal, onChangeSpecies, onUpdateSynonyms, onDetailsChanged, ...props }) => {

    const submitForm = async e => {
        e.preventDefault();

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

            onDetailsChanged();
        } catch (error) {
            notifications.error('Error saving');
            throw error;
        }
    };

    const handleSynonymAddRow = (selected, property, type) => {
        const specificSynonyms = synonyms[property];

        const collection = addSynonymToList(selected, species.id, specificSynonyms, type, listOfSpecies);

        synonyms[property] = collection;
        onUpdateSynonyms(synonyms);
    };

    const handleSynonymRemoveRow = (id, property) => {
        const specificSynonyms = synonyms[property];

        const collection = specificSynonyms.filter((s, i) => i !== id);
        synonyms[property] = collection;

        const deleteId = specificSynonyms[id].id;
        const synonymsToDelete = deleteId ? [deleteId] : undefined;

        onUpdateSynonyms(synonyms, synonymsToDelete);
    };

    const handleChangeMisidentificationAuthor = (rowId, value) => {
        const misidentifications = synonyms.misidentifications;
        misidentifications[rowId].misidentificationAuthor = value;

        synonyms.misidentifications = misidentifications;
        onUpdateSynonyms(synonyms);
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
                    onChangeInput={onChangeSpecies}
                />
                <ChecklistDetailBody
                    species={species}
                    listOfSpeciesOptions={listOfSpeciesOptions}
                    fors={fors}
                    synonyms={synonyms}
                    misidentificationAuthors={props.misidentificationAuthors}
                    onMisidentificationAuthorsChanged={handleChangeMisidentificationAuthor}
                    onSpeciesInputChange={onChangeSpecies}
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
