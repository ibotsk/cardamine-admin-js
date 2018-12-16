import React from 'react';

import TabledPage from './TabledPageParent';
import LosName from '../segments/LosName';

import config from '../../config/config';

const PAGE_DETAIL = "/checklist/detail/";
const EDIT_RECORD = "/chromosome-data/edit/"

const tableHeader = ["ID", "Action", "Orig. identification", "Last revision", "Publ. author", "Year", "n", "2n", "Ploidy",
    "Ploidy revised", "x revised", "Counted by", "Counted date", "N. of plants", "Note", "E/D/A", "Duplicate", "Deposited in",
    "W4", "Country", "Latitude", "Longitude", "Loc. description"];

const formatResult = (result) => {
    return result.data.map(d => {
        console.log(d);
        const origIdentification = d.material.reference["original-identification"];
        const latestRevision = d["latest-revision"];
        return {
            id: d.id,
            action: <a className="btn btn-default btn-sm" href={`${EDIT_RECORD}${d.id}`} >Edit</a>,
            originalIdentification: origIdentification ? <a href={`${PAGE_DETAIL}${origIdentification.id}`} ><LosName key={origIdentification.id} nomen={origIdentification} format='plain' /></a> : "",
            lastRevision: latestRevision ? <a href={`${PAGE_DETAIL}${latestRevision["list-of-species"].id}`} ><LosName key={latestRevision["list-of-species"].id} nomen={latestRevision["list-of-species"]} format='plain' /></a> : "",
            publicationAuthor: d.material.reference.literature ? d.material.reference.literature.paperAuthor : "",
            year: d.material.reference.literature ? d.material.reference.literature.year : "",
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
            w4: d.material["world-l4"] ? d.material["world-l4"].name : "",
            country: d.material.country,
            latitude: d.material.coordinatesGeorefLat ? `${d.material.coordinatesGeorefLat} (gr)` : (d.material.coordinatesLat ? `${d.material.coordinatesLat} (orig)` : ""),
            longitude: d.material.coordinatesGeorefLon ? `${d.material.coordinatesGeorefLon} (gr)` : (d.material.coordinatesLon ? `${d.material.coordinatesLon} (orig)` : ""),
            localityDescription: d.material.description
        }
    });
}

const Cdata = (props) => {

    return (
        <div id='chromosome-data'>
            <h2>Chromosome data</h2>
            {props.children}
        </div>
    )

}

export default TabledPage({
    getAll: config.uris.chromosomeDataUri.getAll,
    getCount: config.uris.chromosomeDataUri.count,
    tableHeader,
    formatResult
})(Cdata);
