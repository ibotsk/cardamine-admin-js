import React from 'react';
import { Button, Glyphicon, Grid } from 'react-bootstrap';

import TabledPage from '../wrappers/TabledPageParent';

import helper from '../../utils/helper';
import config from '../../config/config';

const columns = [
    {
        dataField: 'id',
        text: 'ID'
    },
    {
        dataField: 'type',
        text: 'Type'
    },
    {
        dataField: 'publication',
        text: 'Publication'
    }
];

const formatResult = (data) => {
    return data.map(l => ({
        id: l.id,
        type: config.mappings.displayType[l.displayType],
        publication: helper.parsePublication({
            type: l.displayType,
            authors: l.paperAuthor,
            title: l.paperTitle,
            series: l.seriesSource,
            volume: l.volume,
            issue: l.issue,
            publisher: l.publisher,
            editor: l.editor,
            year: l.year,
            pages: l.pages,
            journal: l.journalName
        })
    })
    );
}

const Publications = (props) => {

    return (
        <div id='publications'>
            <Grid id="functions">
                {/* <div id="functions">
                    <Button bsStyle="success" href={NEW_RECORD}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                </div> */}
                <h2>Publications</h2>
            </Grid>
            {props.children}
        </div>
    )

}

export default TabledPage({
    getAll: config.uris.literaturesUri.getAllWFilterUri,
    getCount: config.uris.literaturesUri.countUri,
    columns,
    formatResult
})(Publications);
