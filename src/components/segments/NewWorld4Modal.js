import React from 'react';

import { Button, Modal } from 'react-bootstrap';

const NewWorld4Modal = (props) => {

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Create new World L4</Modal.Title>
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

export default NewWorld4Modal;