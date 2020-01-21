import React from 'react';

import {
    Panel, Form
} from 'react-bootstrap';

import checklistFacade from '../../../facades/checklist';

import notifications from '../../../utils/notifications';
import helper from '../../../utils/helper';

import ChecklistDetailHeader from './ChecklistDetailHeader';
import ChecklistDetailBody from './ChecklistDetailBody';

class ChecklistDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            listOfSpecies: [],
            species: {},

            synonyms: {},
            // nomenclatoricSynonyms: [], // contains objects of list-of-species
            // taxonomicSynonyms: [], // contains objects of list-of-species
            // invalidDesignations: [],
            // misidentifications: [],

            fors: {},
            // basionymFor: [],
            // replacedFor: [],
            // nomenNovumFor: [],

            misidentificationAuthors: {},

            isNomenclatoricSynonymsChanged: false,
            isTaxonomicSynonymsChanged: false,
            isInvalidDesignationsChanged: false,
            isMisidentificationsChanged: false,
        };
    }

    componentDidMount() {
        const selectedId = this.props.id;
        if (selectedId) {
            this.populateDetailsForEdit(selectedId);
        }
    }

    render() {
        if (!this.props.id) {
            return (
                <Panel>
                    <Panel.Body>Click row to edit details</Panel.Body>
                </Panel>
            );
        }
        return (
            <React.Fragment>
                <Form onSubmit={this.onSubmit} horizontal>
                    <ChecklistDetailHeader
                        data={this.state.species}
                        onShowModal={this.props.onShowModal}
                        onChangeInput={this.handleChangeInput}
                    />
                    <ChecklistDetailBody
                        species={this.state.species}
                        listOfSpeciesOptions={this.state.listOfSpecies}
                        fors={this.state.fors}
                        synonyms={this.state.synonyms}
                        misidentificationAuthors={this.state.misidentificationAuthors}
                        onSpeciesInputChange={this.handleSpeciesChange}
                        onAddRow={this.handleSynonymAddRow}
                        onDeleteRow={this.handleSynonymRemoveRow}
                    />
                </Form>
            </React.Fragment>
        );
    }

    populateDetailsForEdit = async id => {
        const accessToken = this.props.accessToken;

        const species = await checklistFacade.getSpeciesByIdWithFilter(id, accessToken);
        const speciesListRaw = await checklistFacade.getAllSpecies(accessToken);
        const listOfSpecies = speciesListRaw.map(l => ({
            id: l.id,
            label: helper.listOfSpeciesString(l)
        }));

        // const { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations, misidentifications } = await checklistFacade.getSynonyms(id, accessToken);
        const synonyms = await checklistFacade.getSynonyms(id, accessToken);
        // const { basionymFor, replacedFor, nomenNovumFor } = await checklistFacade.getBasionymsFor(id, accessToken);
        const fors = await checklistFacade.getBasionymsFor(id, accessToken);

        const misidentificationAuthors = fors.misidentifications.reduce((acc, curr) => {
            acc[curr.id] = curr.metadata ? curr.metadata.misidentificationAuthor : undefined;
            return acc;
        }, {});

        this.setState({
            species,
            listOfSpecies,
            synonyms,
            fors,
            misidentificationAuthors
        });
    };

    submitForm = async e => {
        e.preventDefault();
        const accessToken = this.props.accessToken;

        const misidentifications = this.state.misidentifications;
        misidentifications.forEach(m => {
            if (!m.metadata) {
                m.metadata = {};
            }
            m.metadata.misidentificationAuthor = this.state.misidentificationAuthors[m.id];
        });

        try {
            await checklistFacade.saveSpeciesAndSynonyms({
                species: this.state.species,
                accessToken,
                nomenclatoricSynonyms: this.state.nomenclatoricSynonyms,
                taxonomicSynonyms: this.state.taxonomicSynonyms,
                invalidDesignations: this.state.invalidDesignations,
                misidentifications,
                isNomenclatoricSynonymsChanged: this.state.isNomenclatoricSynonymsChanged,
                isTaxonomicSynonymsChanged: this.state.isTaxonomicSynonymsChanged,
                isInvalidDesignationsChanged: this.state.isInvalidDesignationsChanged,
                isMisidentificationsChanged: this.state.isMisidentificationsChanged
            });

            notifications.success('Saved');
            // this.props.onTableChange(undefined, {});

            this.setState({
                isNomenclatoricSynonymsChanged: false,
                isTaxonomicSynonymsChanged: false,
                isInvalidDesignationsChanged: false,
                isMisidentificationsChanged: false
            });

            this.props.onDetailsChanged();
        } catch (error) {
            notifications.error('Error saving');
            throw error;
        }
    };

    handleChangeInput = e => this.handleSpeciesChange(e.target.id, e.target.value);

    handleSpeciesChange = (prop, val) => {
        const species = { ...this.state.species };
        species[prop] = val;
        this.setState({
            species
        });
    };

    handleSynonymAddRow = async (selected, property, changedProperty) => {
        const accessToken = this.props.accessToken;
        const synonyms = this.state.synonyms;
        const collectionState = synonyms[property];
        const collection = await addSynonymToList(selected, collectionState, accessToken);

        synonyms[property] = collection;
        this.setState({
            synonyms,
            [changedProperty]: true
        });
    }

    handleSynonymRemoveRow = (id, property, changedProperty) => {
        const collection = this.state[property].filter(s => s.id !== id);
        this.setState({
            [property]: collection,
            [changedProperty]: true
        });
    };

}

async function addSynonymToList(selected, synonyms, accessToken) {
    if (!selected) {
        return null;
    }
    if (synonyms.find(s => s.id === selected.id)) {
        notifications.warning('The item is already in the list');
        return null;
    }
    const synonymJson = await checklistFacade.getSpeciesByIdWithFilter(selected.id, accessToken);
    synonyms.push(synonymJson);
    synonyms.sort(helper.listOfSpeciesSorterLex);
    return synonyms;
}

export default ChecklistDetail;
