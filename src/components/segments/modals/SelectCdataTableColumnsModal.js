import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import PropTypes from 'prop-types';

import CdataColumnsToggleList from '../chromdata/Cdata/CdataColumnsToggleList';

const SelectCdataTableColumnsModal = ({
  show, onHide, toggleListProps: {
    columns, onColumnToggle, toggles,
  },
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Select columns to display</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <CdataColumnsToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
      />
    </Modal.Body>

    <Modal.Footer>
      <Button onClick={onHide}>Close</Button>
    </Modal.Footer>
  </Modal>
);

export default SelectCdataTableColumnsModal;

SelectCdataTableColumnsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  toggleListProps: PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.shape({
      dataField: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })).isRequired,
    onColumnToggle: PropTypes.func.isRequired,
    toggles: PropTypes.objectOf(PropTypes.bool).isRequired,
  }).isRequired,
};
