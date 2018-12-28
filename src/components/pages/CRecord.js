import React, { Component } from 'react';

import {
    Col, 
    Checkbox, ControlLabel, Form, FormControl, FormGroup, Grid
} from 'react-bootstrap';

import axios from 'axios';
import template from 'url-template';

import config from '../../config/config';

class Record extends Component {

    constructor(props) {
        super(props);

        this.getByIdUri = template.parse(config.uris.chromosomeDataUri.getById);
        this.state = {
            chromrecord: {}
        };
    }

    componentDidMount() {
        const recordId = this.props.match.params.recordId;
        if (recordId) {
            const uri = this.getByIdUri.expand({ id: recordId });
            axios.get(uri).then(response => {
                this.setState({ chromrecord: response.data });
            }).catch(e => console.error(e));
        }
    }

    onChange = e => {
        console.log(e.target);
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        console.log(this.state.chromrecord);
        return (
            <div id="chromosome-record">
                <Grid>
                    <h2>Chromosome record</h2>
                    <Form horizontal>
                        <div id="original-identification">
                            {
                                // TODO make identification history as a list/table with editable and movable rows 
                                // leave name as published with errors as is
                            }
                            <h3>Original identification</h3>

                            <FormGroup controlId="reference-los" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Name from checklist:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="Start by typing a name present in database" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="record.material.reference.nameAsPublished" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Name as published<br />
                                    <small>(with spelling errors)</small>:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" onChange={e => this.onChange(e)} placeholder="Name as published" />
                                </Col>
                            </FormGroup>
                        </div>
                        <div id="identification-history">
                            <h3>Identification history</h3>
                        </div>
                        <div id="literature">
                            <h3>Publication</h3>
                            <FormGroup controlId="publication" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Publication:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="Start by typing a publication title present in the database" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="publication-pages" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Data published on pages:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="Data published on pages" />
                                </Col>
                            </FormGroup>
                        </div>
                        <div id="chromosome-data">
                            <h3>Chromosome data</h3>
                            <FormGroup controlId="cd-n" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    n:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-dn" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    2n:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-x" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    x:
                 </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-x-revise" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    x revised:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-ploidy-level" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Ploidy level:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-ploidy-level-revised" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Ploidy level revised:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-counted-by" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Counted by:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="Start by typing" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-counted-date" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Counted date:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-karyotype" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Karyotype:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-n-plants-analysed" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    N° of analysed plants:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-slide-n" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Slide N°:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-deposited-in" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Deposited in:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-drawing-photo-idiogram">
                                <Col sm={10} smOffset={2}>
                                    <Checkbox inline>Drawing</Checkbox>
                                    <Checkbox inline>Photo</Checkbox>
                                    <Checkbox inline>Idiogram</Checkbox>
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-note" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Note:
                                </Col>
                                <Col sm={10}>
                                    <FormControl componentClass="textarea" placeholder="" />
                                </Col>
                            </FormGroup>
                        </div>
                        <div id="material">
                            <h3>Material</h3>
                            <FormGroup controlId="mat-country" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Country:
                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-world4" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    World 4:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="Start by typing country" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-geog-district" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Geogr. district:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-cemu" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    CEMU:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-admin-unit" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Administr. unit:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-closest-village" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Closest village:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-altitude" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Altitude:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-exposition" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Exposition:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-description" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Description:
                                </Col>
                                <Col sm={10}>
                                    <FormControl componentClass="textarea" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-collected-by" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Collected by:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="Start by typing a surname present in the database" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-collected-date" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Collected date:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-identified-by" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Identified by:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="Start by typing a surname present in the database" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-voucher-specimen-n" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Voucher specimen N°:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-deposited-in" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Deposited in:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-checked-by" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Checked by:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="Start by typing a surname present in the database" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-lat-orig" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lat. orig:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-lon-orig" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lon. orig:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-lat-georef" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lat. georef:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="mat-lon-georef" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lon. georef:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" placeholder="" />
                                </Col>
                            </FormGroup>
                        </div>
                    </Form>
                </Grid>
            </div>
        );
    }

}

export default Record;