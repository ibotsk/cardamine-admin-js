import React from 'react';
import {
    Panel, ListGroup, ListGroupItem, Well
} from 'react-bootstrap';

const InfoReportCategory = ({ data, label }) => {
    if (!data) {
        return null;
    }
    const nonEmptyKeysEntries = Object.entries(data).filter(([key]) => key !== "");

    const nonEmptyKeysEntriesLength = nonEmptyKeysEntries.length;
    if (nonEmptyKeysEntriesLength === 0) {
        return null;
    }

    return (
        <Well bsSize="small">
            <h4>{label}</h4>
            <ListGroup>
                {
                    nonEmptyKeysEntries.map(([key, value]) => {
                        const rows = Object.keys(value);
                        return (
                            <ListGroupItem key={key}>
                                <strong>{key}</strong> - used in rows:
                                {Array.isArray(value) ? (
                                    ` ${value.join(', ')} `
                                ) : (
                                        <ul>
                                            {rows.map(r => <li key={r}>{r} - in column: {value[r].map(v => `"${v}"`).join(', ')}</li>)}
                                        </ul>
                                    )}
                            </ListGroupItem>
                        );
                    })
                }
            </ListGroup>
        </Well>
    )
};

const WarningsReport = ({ speciesReport, publicationReport }) => {
    if (!speciesReport && !publicationReport) {
        return null;
    }
    const emptySpecies = speciesReport[""];
    const emptyPublication = publicationReport[""];

    if (!emptySpecies && !emptyPublication) {
        return null;
    }

    return (
        <ListGroup>
            {emptySpecies && <ListGroupItem><strong>Standard name</strong> empty on rows: {emptySpecies.join(", ")}</ListGroupItem>}
            {emptyPublication && <ListGroupItem><strong>Publication</strong> empty on rows: {emptyPublication.join(", ")}</ListGroupItem>}
        </ListGroup>
    );
};

const ReportPanel = ({ panelClass, label, ...props }) => {
    return (
        <Panel bsStyle={panelClass}>
            <Panel.Heading>
                <Panel.Title componentClass="h4" toggle>
                    {label}
                </Panel.Title>
            </Panel.Heading>
            <Panel.Collapse>
                <Panel.Body>
                    {props.children}
                </Panel.Body>
            </Panel.Collapse>
        </Panel>
    );
};

const ImportReport = ({ report }) => {
    return (
        <div id="import-report">
            <ReportPanel panelClass="warning" label="Warnings">
                <WarningsReport speciesReport={report.speciesReport} publicationReport={report.publicationReport} />
            </ReportPanel>

            <ReportPanel panelClass="info" label="Import info">
                <InfoReportCategory data={report.personsReport} label="Persons to be created" />
                <InfoReportCategory data={report.speciesReport} label="Species to be created" />
                <InfoReportCategory data={report.publicationReport} label="Publications to be created" />
            </ReportPanel>
        </div>
    );

};

export default ImportReport;