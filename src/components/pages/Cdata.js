import React from 'react';
import { Button, Glyphicon, Grid } from 'react-bootstrap';

import { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import get from 'lodash.get';

import { NotificationContainer } from 'react-notifications';

import TabledPage from '../wrappers/TabledPageParent';
import LosName from '../segments/LosName';

import config from '../../config/config';

const PAGE_DETAIL = "/checklist/detail/";
const EDIT_RECORD = "/chromosome-data/edit/";
const NEW_RECORD = "/chromosome-data/new";

const columns = [
    {
        dataField: 'id',
        text: 'ID',
        filter: textFilter(),
        headerStyle: { width: '80px' }
    }, {
        dataField: 'action',
        text: 'Action'
    }, {
        dataField: 'originalIdentification',
        text: 'Orig. identification'
    },
    {
        dataField: "lastRevision",
        text: "Last revision"
    },
    {
        dataField: "publicationAuthor",
        text: "Publ. author"
    },
    {
        dataField: "year",
        text: "Year"
    },
    {
        dataField: "n",
        text: "n"
    },
    {
        dataField: "dn",
        text: "2n"
    },
    {
        dataField: "ploidy",
        text: "Ploidy"
    },
    {
        dataField: "ploidyRevised",
        text: "Ploidy revised"
    },
    {
        dataField: "xRevised",
        text: "x revised"
    },
    {
        dataField: "countedBy",
        text: "Counted by"
    },
    {
        dataField: "countedDate",
        text: "Counted date"
    },
    {
        dataField: "nOfPlants",
        text: "N. of plants"
    },
    {
        dataField: "note",
        text: "Note"
    },
    {
        dataField: "eda",
        text: "E/D/A"
    },
    {
        dataField: "duplicate",
        text: "Duplicate"
    },
    {
        dataField: "depositedIn",
        text: "Deposited in"
    },
    {
        dataField: "w4",
        text: "W4"
    },
    {
        dataField: "country",
        text: "Country"
    },
    {
        dataField: "latitude",
        text: "Latitude"
    },
    {
        dataField: "longitude",
        text: "Longitude"
    },
    {
        dataField: "localityDescription",
        text: "Loc. description"
    }
];

const formatResult = (data) => {
    return data.map(d => {
        const origIdentification = get(d, ['material', 'reference', 'original-identification'], '');
        const latestRevision = d["latest-revision"];
        const coordinatesLatGeoref = get(d, 'material.coordinatesGeorefLat', null);
        const coordinatesLonGeoref = get(d, 'material.coordinatesGeorefLon', null);
        const coordinatesLatOrig = get(d, 'material.coordinatesLat', null);
        const coordinatesLonOrig = get(d, 'material.coordinatesLon', null);
        return {
            id: d.id,
            action: <Button bsStyle="warning" bsSize="xsmall" href={`${EDIT_RECORD}${d.id}`}>Edit</Button>,
            originalIdentification: origIdentification ? <a href={`${PAGE_DETAIL}${origIdentification.id}`} ><LosName key={origIdentification.id} data={origIdentification} format='plain' /></a> : "",
            lastRevision: latestRevision ? <a href={`${PAGE_DETAIL}${latestRevision["list-of-species"].id}`} ><LosName key={latestRevision["list-of-species"].id} data={latestRevision["list-of-species"]} format='plain' /></a> : "",
            publicationAuthor: get(d, 'material.reference.literature.paperAuthor', ''),
            year: get(d, 'material.reference.literature.year', ''),
            n: d.n,
            dn: d.dn,
            ploidy: d.ploidyLevel,
            ploidyRevised: d.ploidyLevelRevised,
            xRevised: d.xRevised,
            countedBy: d["counted-by"] ? d["counted-by"].persName : "",
            countedDate: d.countedDate,
            nOfPlants: d.numberOfAnalysedPlants,
            note: d.note,
            eda: '',
            duplicate: d.duplicateData,
            depositedIn: d.depositedIn,
            w4: get(d, ['material', 'world-l4', 'name'], ''),
            country: get(d, 'material.country', ''),
            latitude: coordinatesLatGeoref ? `${coordinatesLatGeoref} (gr)` : (coordinatesLatOrig ? `${coordinatesLatOrig} (orig)` : ''),
            longitude: coordinatesLonGeoref ? `${coordinatesLonGeoref} (gr)` : (coordinatesLonOrig ? `${coordinatesLonOrig} (orig)` : ''),
            localityDescription: get(d, 'material.description')
        }
    });
}

const Cdata = (props) => {

    return (
        <div id='chromosome-data'>
            <Grid id="functions">
                <div id="functions">
                    <Button bsStyle="success" href={NEW_RECORD}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                </div>
                <h2>Chromosome data</h2>
            </Grid>
            <Grid fluid={true}>
                <BootstrapTable hover striped condensed
                    remote={{ filter: true, pagination: true }}
                    keyField='id'
                    data={formatResult(props.data)}
                    columns={columns}
                    filter={filterFactory()}
                    onTableChange={props.onTableChange}
                    pagination={paginationFactory(props.paginationOptions)}
                />
            </Grid>
            <NotificationContainer />
        </div>
    )

}

export default TabledPage({
    getAll: config.uris.chromosomeDataUri.getAllWFilterUri,
    getCount: config.uris.chromosomeDataUri.countUri
})(Cdata);
