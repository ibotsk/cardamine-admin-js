import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import PropTypes from 'prop-types';

const DeleteSpeciesModal = ({ show, onCancel, onConfirm }) => (
  <Modal show={show} onHide={onCancel}>
    <Modal.Header closeButton>
      <Modal.Title>Delete checklist record</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <p>When this record is deleted:</p>
      <ul>
        <li>
          its references in all chromosome records are set to
          <b>empty</b>
        </li>
        <li>
          all identification history records (revisions) it is present in are
          <b>deleted</b>
        </li>
        <li>
          all references to this record as accepted name, basionym, replaced
          name, and nomen novum in other records are set to
          <b>empty</b>
        </li>
        <li>
          if this record is a synonym of any other record, this synonym
          binding is
          <b>deleted</b>
        </li>
        <li>
          if this record has synonyms, all bindings to these synonyms are
          <b>deleted</b>
          {' '}
          (the checklist records themselves
          <b>remain</b>
        </li>
      </ul>
    </Modal.Body>

    <Modal.Footer>
      <Button onClick={onCancel}>Cancel</Button>
      <Button bsStyle="primary" onClick={onConfirm}>
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteSpeciesModal;

DeleteSpeciesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
