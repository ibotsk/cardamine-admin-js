import React from 'react';

import {
    Grid, Col, Row
} from 'react-bootstrap';

const Checklist = (props) => {

    return (
        <Grid fluid={true}>
            <Row>
                <Col sm={6}>
                    list
                </Col>
                <Col sm={6}>
                    edit
                </Col>
            </Row>
        </Grid>
    );

}

export default Checklist;