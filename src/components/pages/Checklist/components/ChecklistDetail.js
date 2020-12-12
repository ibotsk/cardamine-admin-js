import React from 'react';

import {
  Button, Panel, Form, Well,
} from 'react-bootstrap';

import PropTypes from 'prop-types';
import SpeciesType from '../../../propTypes/species';
import SynonymType from '../../../propTypes/synonym';

import { checklistFacade } from '../../../../facades';

import { notifications } from '../../../../utils';

import ChecklistDetailHeader from './ChecklistDetailHeader';
import ChecklistDetailBody from './ChecklistDetailBody';

const submit = async (species, synonyms, deletedSynonyms, accessToken) => {
  try {
    await checklistFacade.saveSpeciesAndSynonyms({
      species,
      accessToken,
      synonyms,
      deletedSynonyms,
    });

    notifications.success('Saved');
  } catch (error) {
    notifications.error('Error saving');
    throw error;
  }
};

const ChecklistDetail = ({
  species,
  listOfSpecies,
  synonyms,
  fors,
  synonymIdsToDelete,
  accessToken,
  onShowEditModal,
  onShowDeleteModal,
  onSynonymsChange,
  onSpeciesChange,
  onDetailsChanged,
}) => {
  const submitForm = async (e) => {
    e.preventDefault();
    submit(species, synonyms, synonymIdsToDelete, accessToken);
    onDetailsChanged();
  };

  const handleSpeciesChange = (prop, val) => {
    const updatedSpecies = { ...species, [prop]: val };
    onSpeciesChange(updatedSpecies);
  };

  const handleSynonymChange = (newSynonyms, idToDelete = undefined) => {
    // idToDelete must be added to list
    let synonymsToDelete = [...synonymIdsToDelete];
    if (idToDelete) {
      synonymsToDelete.push(idToDelete);
      synonymsToDelete = [...new Set(synonymsToDelete)];
    }
    onSynonymsChange(newSynonyms, synonymsToDelete);
  };

  if (!species.id) {
    return (
      <Panel>
        <Panel.Body>Click row to edit details</Panel.Body>
      </Panel>
    );
  }

  return (
    <>
      <Form onSubmit={submitForm} horizontal>
        <div className="scrollable">
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
        </div>
        <Well>
          <Button bsStyle="primary" type="submit">
            Save
          </Button>
        </Well>
      </Form>
    </>
  );
};

export default ChecklistDetail;

ChecklistDetail.propTypes = {
  species: SpeciesType.type,
  listOfSpecies: PropTypes.arrayOf(SpeciesType.type),
  fors: PropTypes.shape({
    basionymFor: PropTypes.arrayOf(SpeciesType.type),
    nomenNovumFor: PropTypes.arrayOf(SpeciesType.type),
    replacedFor: PropTypes.arrayOf(SpeciesType.type),
  }),
  synonyms: PropTypes.shape({
    invalidDesignations: PropTypes.arrayOf(SynonymType.type),
    misidentifications: PropTypes.arrayOf(SynonymType.type),
    nomenclatoricSynonyms: PropTypes.arrayOf(SynonymType.type),
    taxonomicSynonyms: PropTypes.arrayOf(SynonymType.type),
  }),
  synonymIdsToDelete: PropTypes.arrayOf(PropTypes.number),
  accessToken: PropTypes.string.isRequired,
  onShowEditModal: PropTypes.func.isRequired,
  onShowDeleteModal: PropTypes.func.isRequired,
  onSynonymsChange: PropTypes.func.isRequired,
  onSpeciesChange: PropTypes.func.isRequired,
  onDetailsChanged: PropTypes.func.isRequired,
};

ChecklistDetail.defaultProps = {
  species: {},
  listOfSpecies: [],
  fors: {},
  synonyms: {},
  synonymIdsToDelete: [],
};
