import React from 'react';

import {
    Button,
    Panel, Form, Well
} from 'react-bootstrap';

import checklistFacade from '../../../facades/checklist';

import notifications from '../../../utils/notifications';

import ChecklistDetailHeader from './ChecklistDetailHeader';
import ChecklistDetailBody from './ChecklistDetailBody';

const ChecklistDetail = ({
    species,
    listOfSpecies,
    synonyms,
    fors,
    synonymIdsToDelete,
    accessToken,
    onShowEditModal,
    onShowDeleteModal,
    onValueChange,
    onDetailsChanged,
    ...props }) => {

    const submitForm = async e => {
        e.preventDefault();
        submit(species, synonyms, synonymIdsToDelete, accessToken);
        onDetailsChanged();
    };

    const handleSpeciesChange = (prop, val) => {
        const updatedSpecies = { ...species, [prop]: val };
        onValueChange({ species: updatedSpecies });
    };

    const handleSynonymChange = (synonyms, idToDelete = undefined) => {
        // idToDelete must be added to list
        let synonymsToDelete = [...synonymIdsToDelete];
        if (idToDelete) {
            synonymsToDelete.push(idToDelete);
            synonymsToDelete = [...new Set(synonymsToDelete)];
        }
        onValueChange({
            synonyms,
            synonymIdsToDelete: synonymsToDelete
        })
    };

    if (!species.id) {
        return (
            <Panel>
                <Panel.Body>Click row to edit details</Panel.Body>
            </Panel>
        );
    }

    return (
        <React.Fragment>
            <Form onSubmit={submitForm} horizontal>
                <ChecklistDetailHeader
                    data={species}
                    onShowEditModal={onShowEditModal}
                    onShowDeleteModal={onShowDeleteModal}
                    onChangeInput={handleSpeciesChange}
                />
                <ChecklistDetailBody
                    species={species}
                    listOfSpecies={listOfSpecies}
                    fors={fors}
                    synonyms={synonyms}
                    onSpeciesInputChange={handleSpeciesChange}
                    onSynonymsChange={handleSynonymChange}
                />
                <Well>
                    <Button bsStyle="primary" type='submit' >Save</Button>
                </Well>
            </Form>
        </React.Fragment>
    );

};

async function submit(species, synonyms, deletedSynonyms, accessToken) {
    try {
        await checklistFacade.saveSpeciesAndSynonyms({
            species,
            accessToken,
            synonyms,
            deletedSynonyms
        });

        notifications.success('Saved');
    } catch (error) {
        notifications.error('Error saving');
        throw error;
    }
};

export default ChecklistDetail;
