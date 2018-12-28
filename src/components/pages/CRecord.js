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
            chromrecord: {},
            material: {},
            reference: {},
            literature: {}
        };
    }

    componentDidMount() {
        const recordId = this.props.match.params.recordId;
        if (recordId) {
            const getCdataByIdUri = this.getByIdUri.expand({ id: recordId });
            axios.get(getCdataByIdUri).then(response => {
                const cdata = response.data;
                const mat = cdata.material;
                const ref = mat.reference;
                const lit = ref.literature;

                delete cdata.material;
                delete mat.reference;
                delete ref.literature;

                this.setState({
                    chromrecord: cdata,
                    material: mat,
                    reference: ref,
                    literature: lit
                });
            }).catch(e => console.error(e));
        }
    }

    onChange = (e, objName) => {
        const obj = { ...this.state[objName] };
        obj[e.target.id] = e.target.value;
        this.setState({ [objName]: obj });
    }

    render() {
        console.log(this.state);
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
                            <FormGroup controlId="nameAsPublished" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Name as published<br />
                                    <small>(with spelling errors)</small>:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.reference.nameAsPublished || ''} onChange={e => this.onChange(e, 'reference')} placeholder="Name as published" />
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
                            <FormGroup controlId="page" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Data published on pages:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.reference.page || ''} onChange={e => this.onChange(e, 'reference')} placeholder="Data published on pages" />
                                </Col>
                            </FormGroup>
                        </div>
                        <div id="chromosome-data">
                            <h3>Chromosome data</h3>
                            <FormGroup controlId="n" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    n:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.n || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="dn" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    2n:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.dn || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="x" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    x:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text"value={this.state.chromrecord.x || ''} onChange={e => this.onChange(e, 'chromrecord')}  placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="xRevised" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    x revised:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.xRevised || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="ploidyLevel" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Ploidy level:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.ploidyLevel || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="ploidyLevelRevised" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Ploidy level revised:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.ploidyLevelRevised || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
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
                            <FormGroup controlId="countedDate" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Counted date:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.countedDate || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="karyotype" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Karyotype:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.karyotype || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="numberOfAnalysedPlants" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    N° of analysed plants:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.numberOfAnalysedPlants || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="slideNo" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Slide N°:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.slideNo || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="depositedIn" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Deposited in:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.chromrecord.depositedIn || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="cd-drawing-photo-idiogram">
                                <Col sm={10} smOffset={2}>
                                    <Checkbox inline>Drawing</Checkbox>
                                    <Checkbox inline>Photo</Checkbox>
                                    <Checkbox inline>Idiogram</Checkbox>
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="note" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Note:
                                </Col>
                                <Col sm={10}>
                                    <FormControl componentClass="textarea" value={this.state.chromrecord.note || ''} onChange={e => this.onChange(e, 'chromrecord')} placeholder="" />
                                </Col>
                            </FormGroup>
                        </div>
                        <div id="material">
                            <h3>Material</h3>
                            <FormGroup controlId="country" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Country:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.country || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
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
                            <FormGroup controlId="geographicalDistrict" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Geogr. district:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.geographicalDistrict || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="centralEuropeanMappingUnit" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    CEMU:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.centralEuropeanMappingUnit || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="administrativeUnit" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Administr. unit:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.administrativeUnit || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="closestVillageTown" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Closest village:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.closestVillageTown || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="altitude" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Altitude:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.altitude || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="exposition" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Exposition:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.exposition || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="description" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Description:
                                </Col>
                                <Col sm={10}>
                                    <FormControl componentClass="textarea" value={this.state.material.description || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
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
                            <FormGroup controlId="collectedDate" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Collected date:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.collectedDate || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
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
                            <FormGroup controlId="voucherSpecimenNo" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Voucher specimen N°:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.voucherSpecimenNo || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="depositedIn" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Deposited in:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.depositedIn || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
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
                            <FormGroup controlId="coordinatesLat" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lat. orig:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.coordinatesLat || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="coordinatesLon" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lon. orig:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.coordinatesLon || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="coordinatesGeorefLat" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lat. georef:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.coordinatesGeorefLat || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="coordinatesGeorefLon" bsSize="sm">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Lon. georef:
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="text" value={this.state.material.coordinatesGeorefLon || ''} onChange={e => this.onChange(e, 'material')} placeholder="" />
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