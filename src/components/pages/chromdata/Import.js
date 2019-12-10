import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'react-bootstrap';

import CSVReader from 'react-csv-reader';

import importUtils from '../../../utils/import';
import helper from '../../../utils/helper';
import publicationsFacade from '../../../facades/publications';
import world4Facade from '../../../facades/world4';

const handleOnFileLoad = async (data, accessToken) => {
    const dataToImport = importUtils.importCSV(data);

    for (const row of dataToImport) {
        console.log("row: %o", row);
        const references = row.references;

        let idWorld4 = null;
        if (references.idWorld4) {
            // world 4 must be present in the database, if not, it will not be created
            idWorld4 = await world4Facade.getOneByDescription({ description: references.idWorld4, accessToken });
        }
        console.log("world4: %o", idWorld4);

        // literature will be created if not found
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