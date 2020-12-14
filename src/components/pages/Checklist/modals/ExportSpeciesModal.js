import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Button, Modal,
  FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import { exportFacade } from '../../../../facades';

import config from '../../../../config';
import { helperUtils, exportUtils } from '../../../../utils';

const { mappings: { losType, typifications } } = config;
const { listOfSpeciesString } = helperUtils;

const EXPORT_TYPE_DOCX = 'docx';

const formatSynonyms = (synonyms) => {
  if (!synonyms || synonyms.length === 0) {
    return [];
  }
  return synonyms.map(({ synonym, misidentificationAuthor }) => {
    const snts = synonym['synonyms-nomenclatoric-through'];
    return {
      name: listOfSpeciesString(synonym, { isPublication: true }),
      synonymsNomenclatoric: snts
        ? snts.map((snt) => ({
          name: listOfSpeciesString(snt, { isPublication: true }),
        })) : [],
      misidentificationAuthor,
    };
  });
};

const formatForExport = (s) => ({
  id: s.id,
  name: listOfSpeciesString(s, { isPublication: true }),
  ntype: losType[s.ntype].text,
  publication: s.publication,
  typification: s.typification ? typifications[s.typification] : undefined,
  typeLocality: s.typeLocality,
  referenceToTypeDesignation: s.referenceToTypeDesignation,
  indLoc: s.indLoc,
  tribus: s.tribus,
  accepted: listOfSpeciesString(s.accepted, { isPublication: true }),
  basionym: listOfSpeciesString(s.basionym, { isPublication: true }),
  replaced: listOfSpeciesString(s.replaced, { isPublication: true }),
  nomenNovum: listOfSpeciesString(s['nomen-novum'], { isPublication: true }),
  synonymsNomenclatoric: formatSynonyms(s['synonyms-nomenclatoric']),
  synonymsTaxonomic: formatSynonyms(s['synonyms-taxonomic']),
  synonymsInvalid: formatSynonyms(s['synonyms-invalid']),
  synonymsMisidentification: formatSynonyms(s['synonyms-misidentification']),
  basionymFor: s['basionym-for']
    ? s['basionym-for'].map((b) => listOfSpeciesString(
      b, { isPublication: true },
    )) : [],
  replacedFor: s['replaced-for']
    ? s['replaced-for'].map((r) => listOfSpeciesString(
      r, { isPublication: true },
    )) : [],
  nomenNovumFor: s['nomen-novum-for']
    ? s['nomen-novum-for'].map((n) => listOfSpeciesString(
      n, { isPublication: true },
    )) : [],
});

const ExportSpeciesModal = ({
  show, onHide, ids,
}) => {
  const [species, setSpecies] = useState([]);
  const [exportType, setExportType] = useState(EXPORT_TYPE_DOCX);
  const accessToken = useSelector((state) => state.authentication.accessToken);

  const onEnter = async () => {
    const fetchedSpecies = await exportFacade.getChecklistForExport(
      ids, accessToken, formatForExport,
    );
    setSpecies(fetchedSpecies);
  };

  const handleHide = () => {
    setSpecies([]);
    onHide();
  };

  const handleExport = () => {
    if (exportType === EXPORT_TYPE_DOCX) {
      return exportUtils.checklist.docx.createAndDownload(species);
    }
    return undefined;
  };

  return (
    <Modal show={show} onHide={handleHide} onEnter={onEnter}>
      <Modal.Header closeButton>
        <Modal.Title>Export species</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Export as</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="type"
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
          >
            <option value="docx">Word Document - DOCX</option>
          </FormControl>
        </FormGroup>
        <hr />
        Number of records:
        {' '}
        {species.length}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleHide}>Close</Button>
        <Button
          bsStyle="primary"
          onClick={handleExport}
          disabled={species.length < 1}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportSpeciesModal;

ExportSpeciesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  ids: PropTypes.arrayOf(PropTypes.number).isRequired,
};
