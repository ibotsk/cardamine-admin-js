import React from 'react';

import {
    Button,
    Panel, Form, Well
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
            isNomenclatoricSynonymsChanged: false,
            isTaxonomicSynonymsChanged: false,
            isInvalidDesignationsChanged: false,
            isMisidentificationsChanged: false
        };
    }

    render() {
        if (!this.props.species.id) {
            return (
                <Panel>
                    <Panel.Body>Click row to edit details</Panel.Body>
                </Panel>
            );
        }
        const listOfSpeciesOptions = this.props.listOfSpecies.map(l => ({
            id: l.id,
            label: helper.listOfSpeciesString(l)
        }));

        return (
            <React.Fragment>
                <Form onSubmit={this.submitForm} horizontal>
                    <ChecklistDetailHeader
                        data={this.props.species}
                        onShowModal={this.props.onShowModal}
                        onChangeInput={this.props.onChangeSpecies}
                    />
                    <ChecklistDetailBody
                        species={this.props.species}
                        listOfSpeciesOptions={listOfSpeciesOptions}
                        fors={this.props.fors}
                        synonyms={this.props.synonyms}
                        misidentificationAuthors={this.props.misidentificationAuthors}
                        onMisidentificationAuthorsChanged={this.handleChangeMisidentificationAuthors}
                        onSpeciesInputChange={this.props.onChangeSpecies}
                        onAddRow={this.handleSynonymAddRow}
                        onDeleteRow={this.handleSynonymRemoveRow}
                    />
                    <Well>
                        <Button bsStyle="primary" type='submit' >Save</Button>
                    </Well>
                </Form>
            </React.Fragment>
        );
    }

    submitForm = async e => {
        e.preventDefault();
        const accessToken = this.props.accessToken;

        const { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations, misidentifications } = this.props.synonyms;

        misidentifications.forEach(m => {
            if (!m.metadata) {
                m.metadata = {};
            }
            m.metadata.misidentificationAuthor = this.props.misidentificationAuthors[m.id];
        });

        try {
            await checklistFacade.saveSpeciesAndSynonyms({
                species: this.props.species,
                accessToken,
                nomenclatoricSynonyms,
                taxonomicSynonyms,
                invalidDesignations,
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

    handleSynonymAddRow = async (selected, property, changedProperty) => {
        const accessToken = this.props.accessToken;
        const synonyms = this.props.synonyms;
        const collectionState = synonyms[property];
        const collection = await addSynonymToList(selected, collectionState, accessToken);

        synonyms[property] = collection;
        this.props.onChangeValue('synonyms', synonyms);
        this.setState({
            [changedProperty]: true
        });
    }

    handleSynonymRemoveRow = (id, property, changedProperty) => {
        const synonyms = this.props.synonyms;
        const collection = synonyms[property].filter(s => s.id !== id);

        synonyms[property] = collection;
        this.props.onChangeValue('synonyms', synonyms);
        this.setState({
            [changedProperty]: true
        });
    };

    handleChangeMisidentificationAuthors = (rowId, value) => {
        const misidentificationAuthors = this.props.misidentificationAuthors;
        misidentificationAuthors[rowId] = value;
        this.props.onChangeValue('misidentificationAuthors', misidentificationAuthors);
        this.setState({
            isMisidentificationsChanged: true
        });
    }

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
