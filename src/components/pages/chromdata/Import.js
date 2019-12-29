import React from 'react';
import { connect } from 'react-redux';
import { Grid, Button, Panel } from 'react-bootstrap';

import CSVReader from 'react-csv-reader';

import importUtils from '../../../utils/import';
import helper from '../../../utils/helper';
import checklistFacade from '../../../facades/checklist';
import publicationsFacade from '../../../facades/publications';
import personsFacade from '../../../facades/persons';
import world4Facade from '../../../facades/world4';
import ImportReport from './ImportReport';

const loadData = async (data, accessToken) => {
    const dataToImport = importUtils.importCSV(data);

    const records = [];

    for (const row of dataToImport) {
        const { literature: refLiterature, standardizedName: refStandardizedName, idWorld4: refWorld4, ...refPersons } = row.references;

        let idWorld4 = null;
        if (refWorld4) {
            // world 4 must be present in the database, if not, it will not be created
            idWorld4 = await world4Facade.getOneByDescription({ description: refWorld4, accessToken });
        }

        const species = await checklistFacade.getSpeciesByAll(refStandardizedName, accessToken);

        const literatureData = helper.publicationCurateStringDisplayType(refLiterature);
        const publication = await publicationsFacade.getPublicationByAll(literatureData, accessToken);

        const persons = await personsFacade.getPersonsByName(refPersons, accessToken);

        const record = {
            main: row.main,
            references: {
                species,
                publication,
                persons,
                idWorld4
            }
        };

        records.push(record);
    }

    return {
        count: dataToImport.length,
        records
    };
}

class Import extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            submitEnabled: false,
            recordsCount: 0,
            report: {}
        };
    }

    handleOnFileLoad = async (data) => {
        const { count, records } = await loadData(data, this.props.accessToken);

        const report = importUtils.createReport(records);

        this.setState({
            submitEnabled: true,
            recordsCount: count,
            report
        });
    }

    render() {
        return (
            <div id="import">
                <Grid>
                    <Panel>
                        <Panel.Body>
                            <CSVReader onFileLoaded={this.handleOnFileLoad} />
                        </Panel.Body>
                    </Panel>
                    <Panel>
                        <Panel.Body>
                            Records to import: {this.state.recordsCount}

                            <ImportReport report={this.state.report} />
                        </Panel.Body>
                    </Panel>
                    <Button bsStyle='info' disabled={!this.state.submitEnabled}>Import</Button>
                </Grid>
            </div>
        );
    }

};

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(Import);