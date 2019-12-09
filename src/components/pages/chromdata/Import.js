import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'react-bootstrap';

import CSVReader from 'react-csv-reader';

import importUtils from '../../../utils/import';
import helper from '../../../utils/helper';
import publicationsFacade from '../../../facades/publications';

const handleOnFileLoad = async (data, accessToken) => {
    const dataToImport = importUtils.importCSV(data);

    for (const row of dataToImport) {
        console.log("row: %o", row);
        const references = row.references;

        const literatureData = helper.publicationCurateStringDisplayType(references.literature);
        const literature = await publicationsFacade.getPublicationByAll({ literatureData, accessToken });
        console.log("lit: %o", literature);

    }
    // TODO this needs to be done for each element of dataToImport array
    // get id references and update objects
    // if record was not found, mark it for creation, but do not create it. That will be done after clicking submit button
}

const Import = props => {

    return (
        <div id="import">
            <Grid>
                <CSVReader onFileLoaded={data => handleOnFileLoad(data, props.accessToken)} />
            </Grid>
        </div>
    );

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(Import);