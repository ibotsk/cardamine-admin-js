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

            isNomenclatoricSynonymsChanged: false,
            isTaxonomicSynonymsChanged: false,
            isInvalidDesignationsChanged: false,
            isMisidentificationsChanged: false
        };
    }

    async componentDidMount() {
        const speciesListRaw = await checklistFacade.getAllSpecies(this.props.accessToken)
        const listOfSpecies = speciesListRaw.map(l => ({
            id: l.id,
            label: helper.listOfSpeciesString(l)
        }));
        this.setState({
            listOfSpecies
        });
    }

    render() {
        if (!this.props.species.id) {
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
                        data={this.props.species}
                        onShowModal={this.props.onShowModal}
                        onChangeInput={this.handleChangeSpecies}
                    />
                    {/* <ChecklistDetailBody
                        species={this.props.species}
                        listOfSpeciesOptions={this.state.listOfSpecies}
                        fors={this.props.fors}
                        synonyms={this.props.synonyms}
                        misidentificationAuthors={this.props.misidentificationAuthors}
                        onSpeciesInputChange={this.handleSpeciesChange}
                        onAddRow={this.handleSynonymAddRow}
                        onDeleteRow={this.handleSynonymRemoveRow}
                    /> */}
                </Form>
            </React.Fragment>
        );
    }

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

    handleChangeSpecies = (prop, val) => this.props.onChangeSpecies(prop, val);

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
