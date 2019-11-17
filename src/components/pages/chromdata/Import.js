import React from 'react';
import { Grid } from 'react-bootstrap';

import CSVReader from 'react-csv-reader';

const Import = props => {

    return (
        <div id="import">
            <Grid>
                <CSVReader onFileLoaded={data => console.log(data)} />
            </Grid>
        </div>
    );

}

export default Import;