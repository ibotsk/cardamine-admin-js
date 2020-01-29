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
                misidentifications
            });

            notifications.success('Saved');

            this.props.onDetailsChanged();
        } catch (error) {
            notifications.error('Error saving');
            throw error;
        }
    };

    handleSynonymAddRow = (selected, property, type) => {
        const synonyms = this.props.synonyms;
        const specificSynonyms = synonyms[property];

        const collection = this.addSynonymToList(selected, this.props.species.id, specificSynonyms, type);

        synonyms[property] = collection;
        this.props.onUpdateSynonyms(synonyms, []);
    }

    handleSynonymRemoveRow = (id, property) => {
        const synonyms = this.props.synonyms;
        const specificSynonyms = synonyms[property];

        const collection = specificSynonyms.filter((s, i) => i !== id);
        synonyms[property] = collection;

        const deleteId = specificSynonyms[id].id;
        const synonymsToDelete = deleteId ? [deleteId] : [];

        this.props.onUpdateSynonyms(synonyms, synonymsToDelete);
    };

    handleChangeMisidentificationAuthors = (rowId, value) => {
        const misidentificationAuthors = this.props.misidentificationAuthors;
        misidentificationAuthors[rowId] = value;
        this.props.onChangeValue('misidentificationAuthors', misidentificationAuthors);
        this.setState({
            isMisidentificationsChanged: true
        });
    }

    addSynonymToList = (selected, idParent, synonyms, type) => {
        if (!selected) {
            return synonyms;
        }
        if (synonyms.find(s => s.synonym.id === selected.id)) {
            notifications.warning('The item already exists in the list');
            return synonyms;
        }

        const synonymObj = checklistFacade.createSynonym(idParent, selected.id, type);
        const species = this.props.listOfSpecies.find(l => l.id === selected.id);
        synonymObj.synonym = species;

        synonyms.push(synonymObj);
        synonyms.sort(helper.listOfSpeciesSorterLex);
        return synonyms;
    }

}

export default ChecklistDetail;
