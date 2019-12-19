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

const loadData = async (data, accessToken) => {
    const dataToImport = importUtils.importCSV(data);

    for (const row of dataToImport) {
        console.log("row: %o", row);
        const { literature: refLiterature, standardizedName: refStandardizedName, idWorld4: refWorld4, ...refPersons } = row.references;

        let idWorld4 = null;
        if (refWorld4) {
            // world 4 must be present in the database, if not, it will not be created
            idWorld4 = await world4Facade.getOneByDescription({ description: refWorld4, accessToken });
        }
        console.log({ idWorld4 });

        const species = await checklistFacade.getSpeciesByAll(refStandardizedName, accessToken);
        console.log({ species });

        // literature will be created if not found
        const literatureData = helper.publicationCurateStringDisplayType(refLiterature);
        const publication = await publicationsFacade.getPublicationByAll(literatureData, accessToken);
        console.log({ publication });

        const persons = await personsFacade.getPersonsByName(refPersons, accessToken);
        console.log({ persons });

    }

    return {
        count: dataToImport.length
    };
}

class Import extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showSubmit: false,
            recordsInfo: {
                count: 0
            }
        };
    }

    handleOnFileLoad = async (data) => {
        const { count } = await loadData(data, this.props.accessToken);

        const recordsInfo = this.state.recordsInfo;

        recordsInfo.count = count;

        this.setState({
            showSubmit: true,
            recordsInfo
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
                            Records to import: {this.state.recordsInfo.count}
                        </Panel.Body>
                    </Panel>
                    {
                        this.state.showSubmit &&
                        <Button bsStyle='info'>Create new</Button>
                    }
                </Grid>
            </div>
        );
    }

};

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(Import);