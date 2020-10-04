import React from 'react';
import { connect } from 'react-redux';

import {
  Col,
  Grid,
  Row,
  InputGroup,
  Button,
  Checkbox,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';

import { NotificationContainer } from 'react-notifications';

import { notifications } from '../../utils';

import { crecordFacade } from '../../facades';

import LosName from '../segments/LosName';
import PersonModal from '../segments/modals/PersonModal';
import PublicationModal from '../segments/modals/PublicationModal';
import SpeciesNameModal from '../segments/modals/SpeciesNameModal';

import config from '../../config';

const { constants } = config;

const revisionsColumns = [
  {
    dataField: 'id',
    text: 'Name',
    // , rowIndex, formatExtraData
    formatter: (cell, row) => <LosName data={row['list-of-species']} />,
  },
  {
    dataField: 'hDate',
    text: 'Date',
  },
];

const CHROM_DATA_LIST_URI = '/chromosome-data';
const SELECTED = (prop) => `${prop}Selected`;

class Record extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chromrecord: {}, // to save
      material: {}, // to save
      coordinateGeorefLat: undefined, // taken from material; must be put to material before saving
      coordinateGeorefLon: undefined,
      reference: {}, // to save
      dna: {}, // to save
      histories: [], // to save - not persisted yet
      listOfSpecies: [],
      persons: [],
      world4s: [],
      literatures: [],
      modals: {
        showModalPerson: false,
        showModalLiterature: false,
        showModalSpecies: false,
      },
      idStandardisedNameSelected: undefined,
      idLiteratureSelected: undefined,
      countedBySelected: undefined,
      idWorld4Selected: undefined,
      collectedBySelected: undefined,
      identifiedBySelected: undefined,
      checkedBySelected: undefined,
    };
  }

  async componentDidMount() {
    await this.getChromosomeRecord();
    await this.getLists();
  }

  getChromosomeRecord = async () => {
    const { accessToken, match } = this.props;
    const { recordId } = match.params;

    const {
      chromrecord,
      dna,
      material,
      reference,
      histories,
    } = await crecordFacade.getChromosomeRecord(accessToken, recordId);

    let coordinateGeorefLat;
    let coordinateGeorefLon;

    const { coordinatesGeoref } = material;

    if (coordinatesGeoref) {
      coordinateGeorefLat = coordinatesGeoref.coordinates.lat;
      coordinateGeorefLon = coordinatesGeoref.coordinates.lon;
    }

    this.setState({
      chromrecord,
      dna,
      material,
      reference,
      histories,
      coordinateGeorefLat,
      coordinateGeorefLon,
    });
  };

  getLists = async () => {
    const { accessToken } = this.props;
    const { chromrecord, reference, material } = this.state;

    const {
      listOfSpecies,
      idStandardisedNameSelected,
    } = await crecordFacade.getSpecies(
      accessToken,
      reference.idStandardisedName,
    );

    const { countedBy } = chromrecord;
    const {
      collectedBy, identifiedBy, checkedBy, idWorld4,
    } = material;
    const { idLiterature } = reference;
    const {
      persons,
      countedBySelected,
      collectedBySelected,
      identifiedBySelected,
      checkedBySelected,
    } = await crecordFacade.getPersons(accessToken, {
      countedBy,
      collectedBy,
      identifiedBy,
      checkedBy,
    });

    const { world4s, idWorld4Selected } = await crecordFacade.getWorld4s(
      accessToken,
      idWorld4,
    );

    const {
      literatures,
      idLiteratureSelected,
    } = await crecordFacade.getLiteratures(accessToken, idLiterature);

    this.setState({
      listOfSpecies,
      literatures,
      persons,
      world4s,
      idStandardisedNameSelected,
      idLiteratureSelected,
      countedBySelected,
      collectedBySelected,
      identifiedBySelected,
      checkedBySelected,
      idWorld4Selected,
    });
  };

  showModalPerson = () => this.setState({ showModalPerson: true });

  showModalLiterature = () => this.setState({ showModalLiterature: true });

  showModalSpecies = () => this.setState({ showModalSpecies: true });

  hideModal = async () => {
    const { modals } = this.state;
    for (const key of Object.keys(modals)) {
      modals[key] = false;
    }
    await this.getLists();
    this.setState({ modals });
  };

  onChangeTextInput = (e, objName) => {
    // id is set from FormGroup controlId
    this.onChangeInput(objName, e.target.id, e.target.value);
  };

  onChangeCheckbox = (e, objName) => {
    this.onChangeInput(objName, e.target.name, e.target.checked);
  };

  onChangeInput = (objName, property, value) => {
    this.setState((state) => {
      const obj = state[objName];
      obj[property] = value;
      return {
        [objName]: obj,
      };
    });
  };

  onChangeTypeaheadChromrecord = (selected, prop) => {
    this.onChangeTypeahead(selected, 'chromrecord', prop);
  };

  onChangeTypeaheadMaterial = (selected, prop) => {
    this.onChangeTypeahead(selected, 'material', prop);
  };

  onChangeTypeahead = (selected, objName, prop) => {
    this.setState((state) => {
      const obj = state[objName];
      obj[prop] = null;

      if (selected && selected.length > 0) {
        obj[prop] = selected[0].id;

        const { id, label, ...noIdLabel } = selected[0]; // loop properties in selected (except id and label) and try to assign them to the obj
        for (const key of Object.keys(noIdLabel)) {
          if (key in obj) {
            obj[key] = noIdLabel[key];
          }
        }
      }
      return {
        [SELECTED(prop)]: selected,
        [objName]: obj,
      };
    });
  };

  getValidationLat = () => {
    const { coordinateGeorefLat } = this.state;
    const regex = new RegExp(constants.regexLatitude);
    if (!coordinateGeorefLat || regex.test(coordinateGeorefLat)) {
      return 'success';
    }
    return 'error';
  }

  getValidationLon = () => {
    const { coordinateGeorefLon } = this.state;
    const regex = new RegExp(constants.regexLongitude);
    if (!coordinateGeorefLon || regex.test(coordinateGeorefLon)) {
      return 'success';
    }
    return 'error';
  }

  submitForm = async (event) => {
    event.preventDefault();
    const { accessToken } = this.props;
    const {
      chromrecord, dna, material, reference,
      coordinateGeorefLat, coordinateGeorefLon,
    } = this.state;

    if (coordinateGeorefLat && coordinateGeorefLon) {
      material.coordinatesGeoref = {
        coordinates: {
          lat: coordinateGeorefLat,
          lon: coordinateGeorefLon,
        },
      };
    } else {
      material.coordinatesGeoref = null;
    }

    try {
      await crecordFacade.saveUpdateChromrecordWithAll(
        {
          chromrecord,
          dna,
          material,
          reference,
        },
        accessToken,
      );

      const { router } = this.context;
      router.history.push(CHROM_DATA_LIST_URI); // redirect to chromosome data
      notifications.success('Saved');
    } catch (error) {
      notifications.error('Error saving');
      throw error;
    }
  };

  render() {
    const { history } = this.props;
    const {
      chromrecord,
      material,
      reference,
      histories,
      literatures,
      persons,
      dna,
      listOfSpecies,
      world4s,
      coordinateGeorefLat,
      coordinateGeorefLon,
    } = this.state;

    const {
      idStandardisedNameSelected,
      idLiteratureSelected,
      countedBySelected,
      collectedBySelected,
      identifiedBySelected,
      checkedBySelected,
      idWorld4Selected,
    } = this.state;

    const { modals } = this.state;

    return (
      <div id="chromosome-record">
        <Grid>
          <h2>
            Chromosome record
            <small>{chromrecord.id ? chromrecord.id : 'new'}</small>
          </h2>
          <Form horizontal onSubmit={(e) => this.submitForm(e)}>
            <div id="identification">
              <h3>Identification</h3>
              <FormGroup controlId="nameAsPublished" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Name as published
                  <br />
                  <small>(with spelling errors)</small>
                  :
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={reference.nameAsPublished || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'reference')}
                    placeholder="Name as published"
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="original-identification" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Original identification
                  <br />
                  <small>(name from checklist)</small>
                  :
                </Col>
                <Col sm={10}>
                  <InputGroup bsSize="sm">
                    <Typeahead
                      id="original-identification-autocomplete"
                      options={listOfSpecies}
                      selected={idStandardisedNameSelected}
                      onChange={(selected) => this.onChangeTypeahead(
                        selected,
                        'reference',
                        'idStandardisedName',
                      )}
                      placeholder="Start typing a species in the database"
                    />
                    <InputGroup.Button>
                      <Button bsStyle="info" onClick={this.showModalSpecies}>
                        Create new
                      </Button>
                    </InputGroup.Button>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Identification history - revisions
                  <br />
                  <small>(names from checklist)</small>
                  :
                </Col>
                <Col sm={10}>
                  <BootstrapTable
                    condensed
                    keyField="id"
                    data={histories}
                    columns={revisionsColumns}
                  />
                </Col>
              </FormGroup>
            </div>
            <div id="literature">
              <h3>Publication</h3>
              <FormGroup controlId="publication" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Publication:
                </Col>
                <Col sm={10}>
                  <InputGroup bsSize="sm">
                    <Typeahead
                      id="publication-autocomplete"
                      options={literatures}
                      selected={idLiteratureSelected}
                      onChange={(selected) => this.onChangeTypeahead(
                        selected,
                        'reference',
                        'idLiterature',
                      )}
                      placeholder="Start typing a publication in the database"
                    />
                    <InputGroup.Button>
                      <Button bsStyle="info" onClick={this.showModalLiterature}>
                        Create new
                      </Button>
                    </InputGroup.Button>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup controlId="page" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Data published on pages:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={reference.page || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'reference')}
                    placeholder="Data published on pages"
                  />
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
                  <FormControl
                    type="text"
                    value={chromrecord.n || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="dn" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  2n:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={chromrecord.dn || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="x" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  x:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={chromrecord.x || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="xRevised" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  x revised:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={chromrecord.xRevised || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="ploidyLevel" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Ploidy level:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={chromrecord.ploidyLevel || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="ploidyLevelRevised" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Ploidy level revised:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={chromrecord.ploidyLevelRevised || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="countedBy" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Counted by:
                </Col>
                <Col sm={10}>
                  <InputGroup bsSize="sm">
                    <Typeahead
                      id="counted-by-autocomplete"
                      options={persons}
                      selected={countedBySelected}
                      onChange={(selected) => this.onChangeTypeaheadChromrecord(
                        selected,
                        'countedBy',
                      )}
                      placeholder="Start typing a surname
                      present in the database"
                    />
                    <InputGroup.Button>
                      <Button bsStyle="info" onClick={this.showModalPerson}>
                        Create new
                      </Button>
                    </InputGroup.Button>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup controlId="countedDate" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Counted date:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={chromrecord.countedDate || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="karyotype" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Karyotype:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={chromrecord.karyotype || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="numberOfAnalysedPlants" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  N° of analysed plants:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={chromrecord.numberOfAnalysedPlants || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="slideNo" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Slide N°:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={chromrecord.slideNo || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="depositedIn" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Deposited in:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={chromrecord.depositedIn || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={10} smOffset={2}>
                  <Checkbox
                    inline
                    name="drawing"
                    value={chromrecord.drawing || false}
                    checked={chromrecord.drawing || false}
                    onChange={(e) => this.onChangeCheckbox(e, 'chromrecord')}
                  >
                    Drawing
                  </Checkbox>
                  <Checkbox
                    inline
                    name="photo"
                    value={chromrecord.photo || false}
                    checked={chromrecord.photo || false}
                    onChange={(e) => this.onChangeCheckbox(e, 'chromrecord')}
                  >
                    Photo
                  </Checkbox>
                  <Checkbox
                    inline
                    name="idiogram"
                    value={chromrecord.idiogram || false}
                    checked={chromrecord.idiogram || false}
                    onChange={(e) => this.onChangeCheckbox(e, 'chromrecord')}
                  >
                    Idiogram
                  </Checkbox>
                </Col>
              </FormGroup>
              <FormGroup controlId="note" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Note:
                </Col>
                <Col sm={10}>
                  <FormControl
                    componentClass="textarea"
                    value={chromrecord.note || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'chromrecord')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
            </div>
            <div id="dna">
              <h3>DNA data</h3>
              <FormGroup controlId="method" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Method:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={dna.method || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="chCount" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Chromosome count:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={dna.chCount || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>

              <FormGroup bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Genome size:
                </Col>
                <Col sm={2}>
                  <FormControl
                    id="sizeC"
                    type="text"
                    value={dna.sizeC || 'Cx'}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder=""
                  />
                </Col>
                <Col sm={2}>
                  <FormControl
                    id="sizeFrom"
                    type="text"
                    value={dna.sizeFrom || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder="Size from"
                    description="Size from"
                  />
                </Col>
                <Col sm={2}>
                  <FormControl
                    id="sizeTo"
                    type="text"
                    value={dna.sizeTo || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder="Size to"
                    description="Size to"
                  />
                </Col>
                <Col sm={2}>
                  <FormControl
                    id="sizeUnits"
                    type="text"
                    value={dna.sizeUnits || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder="Size units"
                    description="Size units"
                  />
                </Col>
              </FormGroup>

              <FormGroup controlId="ploidy" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Ploidy:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={dna.ploidy || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="ploidyRevised" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Ploidy revised:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={dna.ploidyRevised || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="plantsAnalysed" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Number of analysed plants:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={dna.plantsAnalysed || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="numberAnalyses" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Number of analyses:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={dna.numberAnalyses || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="note" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Note:
                </Col>
                <Col sm={10}>
                  <FormControl
                    componentClass="textarea"
                    value={dna.note || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'dna')}
                    placeholder=""
                  />
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
                  <FormControl
                    type="text"
                    value={material.country || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="world4" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  World 4:
                </Col>
                <Col sm={10}>
                  <Typeahead
                    id="world4-autocomplete"
                    options={world4s}
                    selected={idWorld4Selected}
                    onChange={(selected) => this.onChangeTypeahead(
                      selected,
                      'material',
                      'idWorld4',
                    )}
                    placeholder="Start typing a country present in the database"
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="geographicalDistrict" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Geogr. district:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.geographicalDistrict || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="centralEuropeanMappingUnit" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  CEMU:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.centralEuropeanMappingUnit || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="administrativeUnit" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Administr. unit:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.administrativeUnit || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="closestVillageTown" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Closest village:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.closestVillageTown || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="altitude" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Altitude:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.altitude || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="exposition" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Exposition:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.exposition || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="description" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Description:
                </Col>
                <Col sm={10}>
                  <FormControl
                    componentClass="textarea"
                    value={material.description || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="collectedBy" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Collected by:
                </Col>
                <Col sm={10}>
                  <InputGroup bsSize="sm">
                    <Typeahead
                      id="collected-by-autocomplete"
                      options={persons}
                      selected={collectedBySelected}
                      onChange={(selected) => this.onChangeTypeaheadMaterial(
                        selected,
                        'collectedBy',
                      )}
                      placeholder="Start typing a surname
                      present in the database"
                    />
                    <InputGroup.Button>
                      <Button bsStyle="info" onClick={this.showModalPerson}>
                        Create new
                      </Button>
                    </InputGroup.Button>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup controlId="collectedDate" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Collected date:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.collectedDate || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="identifiedBy" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Identified by:
                </Col>
                <Col sm={10}>
                  <InputGroup bsSize="sm">
                    <Typeahead
                      id="identified-by-autocomplete"
                      options={persons}
                      selected={identifiedBySelected}
                      onChange={(selected) => this.onChangeTypeaheadMaterial(
                        selected,
                        'identifiedBy',
                      )}
                      placeholder="Start typing a surname
                      present in the database"
                    />
                    <InputGroup.Button>
                      <Button bsStyle="info" onClick={this.showModalPerson}>
                        Create new
                      </Button>
                    </InputGroup.Button>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup controlId="voucherSpecimenNo" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Voucher specimen N°:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.voucherSpecimenNo || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="depositedIn" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Deposited in:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.depositedIn || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="checkedBy" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Checked by:
                </Col>
                <Col sm={10}>
                  <InputGroup bsSize="sm">
                    <Typeahead
                      id="checked-by-autocomplete"
                      options={persons}
                      selected={checkedBySelected}
                      onChange={(selected) => this.onChangeTypeaheadMaterial(
                        selected,
                        'checkedBy',
                      )}
                      placeholder="Start typing a surname
                      present in the database"
                    />
                    <InputGroup.Button>
                      <Button bsStyle="info" onClick={this.showModalPerson}>
                        Create new
                      </Button>
                    </InputGroup.Button>
                  </InputGroup>
                </Col>
              </FormGroup>
              <Row>
                <Col sm={10} smOffset={2}>
                  <h5>
                    Original coordinates are a
                    {' '}
                    <b>free-text</b>
                    .
                    {' '}
                    Please insert values as published.
                  </h5>
                </Col>
              </Row>
              <FormGroup controlId="coordinatesLat" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Lat. orig:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.coordinatesLat || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="coordinatesLon" bsSize="sm">
                <Col componentClass={ControlLabel} sm={2}>
                  Lon. orig:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={material.coordinatesLon || ''}
                    onChange={(e) => this.onChangeTextInput(e, 'material')}
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <Row>
                <Col sm={10} smOffset={2}>
                  <h5>
                    Georeferenced coordinate must be a
                    {' '}
                    <b>number with decimal point</b>
                    .
                  </h5>
                </Col>
              </Row>
              <FormGroup
                bsSize="sm"
                controlId="coordinateGeorefLat"
                validationState={this.getValidationLat()}
              >
                <Col componentClass={ControlLabel} sm={2}>
                  Lat. georef:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={coordinateGeorefLat || ''}
                    onChange={(e) => this.setState({
                      coordinateGeorefLat: e.target.value,
                    })}
                    placeholder=""
                    pattern={constants.regexLatitude}
                  />
                </Col>
              </FormGroup>
              <FormGroup
                bsSize="sm"
                controlId="coordinateGeorefLon"
                validationState={this.getValidationLon()}
              >
                <Col componentClass={ControlLabel} sm={2}>
                  Lon. georef:
                </Col>
                <Col sm={10}>
                  <FormControl
                    type="text"
                    value={coordinateGeorefLon || ''}
                    onChange={(e) => this.setState({
                      coordinateGeorefLon: e.target.value,
                    })}
                    placeholder=""
                    pattern={constants.regexLongitude}
                  />
                </Col>
              </FormGroup>
            </div>
            <Row>
              <Col sm={5} smOffset={2}>
                <Button bsStyle="default" onClick={history.goBack}>
                  Cancel
                </Button>
              </Col>
              <Col sm={5}>
                <Button bsStyle="primary" type="submit">
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Grid>
        <PersonModal show={modals.showModalPerson} onHide={this.hideModal} />
        <PublicationModal
          show={modals.showModalLiterature}
          onHide={this.hideModal}
        />
        <SpeciesNameModal
          show={modals.showModalSpecies}
          onHide={this.hideModal}
        />
        <NotificationContainer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(Record);

Record.propTypes = {
  // rowId: PropTypes.number.
  accessToken: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      recordId: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Record.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  }),
};
