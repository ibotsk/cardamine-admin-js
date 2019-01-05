import React from 'react';

import { Button, Modal } from 'react-bootstrap';

const NewSpeciesNameModal = (props) => {

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Create new name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Abcd
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
                <Button bsStyle="primary">Save changes</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default NewSpeciesNameModal;