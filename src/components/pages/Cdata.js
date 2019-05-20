import React from 'react';
import { connect } from 'react-redux';
import { setPagination } from '../../actions';

import get from 'lodash.get';

import { Button, Glyphicon, Grid } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table2-toolkit';

import { NotificationContainer } from 'react-notifications';

import TabledPage from '../wrappers/TabledPageParent';
import LosName from '../segments/LosName';

import formatter from '../../utils/formatter';
import config from '../../config/config';

const PAGE_DETAIL = "/names/";
const EDIT_RECORD = "/chromosome-data/edit/";
const NEW_RECORD = "/chromosome-data/new";

const { ToggleList } = ColumnToggle;
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
        text: "n",
        hidden: true
    },
    {
        dataField: "dn",
        text: "2n"
    },
    {
        dataField: "ploidy",
        text: "Ploidy",
        hidden: true
    },
    {
        dataField: "ploidyRevised",
        text: "Ploidy revised",
        hidden: true
    },
    {
        dataField: "xRevised",
        text: "x revised",
        hidden: true
    },
    {
        dataField: "countedBy",
        text: "Counted by",
        hidden: true
    },
    {
        dataField: "countedDate",
        text: "Counted date",
        hidden: true
    },
    {
        dataField: "nOfPlants",
        text: "N. of plants",
        hidden: true
    },
    {
        dataField: "note",
        text: "Note",
        hidden: true
    },
    {
        dataField: "eda",
        text: "E/D/A",
        hidden: true
    },
    {
        dataField: "duplicate",
        text: "Duplicate",
        hidden: true
    },
    {
        dataField: "depositedIn",
        text: "Deposited in",
        hidden: true
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

const getInitialToggles = (columns) => {
    return columns.reduce((obj, el) => {
        const key = el.dataField;
        obj[key] = !!!el.hidden;
        return obj;
    }, {});
}

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
            eda: formatter.eda({ ambiguous: d.ambiguousRecord, doubtful: d.doubtfulRecord, erroneous: d.erroneousRecord }),
            duplicate: d.duplicateData,
            depositedIn: d.depositedIn,
            w4: get(d, ['material', 'world-l4', 'description'], ''),
            country: get(d, 'material.country', ''),
            latitude: coordinatesLatGeoref ? `${coordinatesLatGeoref} (gr)` : (coordinatesLatOrig ? `${coordinatesLatOrig} (orig)` : ''),
            longitude: coordinatesLonGeoref ? `${coordinatesLonGeoref} (gr)` : (coordinatesLonOrig ? `${coordinatesLonOrig} (orig)` : ''),
            localityDescription: get(d, 'material.description')
        });
    });
}

class Cdata extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            toggles: getInitialToggles(columns)
        };
    }

    onTableChangeWithDispatch = (type, newState) => {
        this.props.onChangePage(newState.page, newState.sizePerPage);
        this.props.onTableChange(type, newState);
    }

    onColumnToggleWithDispatch = (tkProps, param) => {
        tkProps.columnToggleProps.onColumnToggle(param);
        this.setState({
            toggles: tkProps.columnToggleProps.toggles
        });
    }

    render() {
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
                    <ToolkitProvider
                        columnToggle
                        keyField="id"
                        data={formatResult(this.props.data)}
                        columns={columns}
                    >
                        {
                            tkProps => (
                                <div>
                                    <ToggleList
                                        {...tkProps.columnToggleProps}
                                        toggles={this.state.toggles || tkProps.columnToggleProps.toggles}
                                        onColumnToggle={(p) => this.onColumnToggleWithDispatch(tkProps, p)}
                                    />
                                    <hr />
                                    <BootstrapTable hover striped condensed
                                        {...tkProps.baseProps}
                                        remote={{ filter: true, pagination: true }}
                                        filter={filterFactory()}
                                        onTableChange={this.onTableChangeWithDispatch}
                                        pagination={paginationFactory(this.props.paginationOptions)}
                                    />
                                </div>
                            )
                        }
                    </ToolkitProvider>
                </Grid>
                <NotificationContainer />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken,
    page: state.pagination.page,
    pageSize: state.pagination.pageSize
});

const mapDispatchToProps = dispatch => {
    return {
        onChangePage: (page, pageSize) => {
            dispatch(setPagination({ page, pageSize }));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    TabledPage({
        getAll: config.uris.chromosomeDataUri.getAllWFilterUri,
        getCount: config.uris.chromosomeDataUri.countUri
    })(Cdata)
);
