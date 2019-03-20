import React from 'react';
import { connect } from 'react-redux';

import { Button, Glyphicon, Grid } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import get from 'lodash.get';

import { NotificationContainer } from 'react-notifications';

import TabledPage from '../wrappers/TabledPageParent';
import LosName from '../segments/LosName';

import config from '../../config/config';

const PAGE_DETAIL = "/names/";
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

const formatResult = data => {
    return data.map(d => {
        const origIdentification = get(d, ['material', 'reference', 'original-identification'], '');
        const latestRevision = d["latest-revision"];
        const coordinatesLatGeoref = get(d, 'material.coordinatesGeorefLat', null);
        const coordinatesLonGeoref = get(d, 'material.coordinatesGeorefLon', null);
        const coordinatesLatOrig = get(d, 'material.coordinatesLat', null);
        const coordinatesLonOrig = get(d, 'material.coordinatesLon', null);
        return ({
            id: d.id,
            action: (
                <LinkContainer to={`${EDIT_RECORD}${d.id}`}>
                    <Button bsStyle="warning" bsSize="xsmall">Edit</Button>
                </LinkContainer>
            ),
            originalIdentification: origIdentification ? <Link to={`${PAGE_DETAIL}${origIdentification.id}`} ><LosName key={origIdentification.id} data={origIdentification} format='plain' /></Link> : "",
            lastRevision: latestRevision ? <Link to={`${PAGE_DETAIL}${latestRevision["list-of-species"].id}`} ><LosName key={latestRevision["list-of-species"].id} data={latestRevision["list-of-species"]} format='plain' /></Link> : "",
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
        });
    });
}

const Cdata = ({ data, paginationOptions, onTableChange }) => {

    return (
        <div id='chromosome-data'>
            <Grid id="functions">
                <div id="functions">
                    <LinkContainer to={NEW_RECORD}>
                        <Button bsStyle="success"><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                    </LinkContainer>
                </div>
                <h2>Chromosome data</h2>
            </Grid>
            <Grid fluid={true}>
                <BootstrapTable hover striped condensed
                    remote={{ filter: true, pagination: true }}
                    keyField='id'
                    data={formatResult(data)}
                    columns={columns}
                    filter={filterFactory()}
                    onTableChange={onTableChange}
                    pagination={paginationFactory(paginationOptions)}
                />
            </Grid>
            <NotificationContainer />
        </div>
    )

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(
    TabledPage({
        getAll: config.uris.chromosomeDataUri.getAllWFilterUri,
        getCount: config.uris.chromosomeDataUri.countUri
    })(Cdata)
);
