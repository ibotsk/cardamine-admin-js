import React from 'react';
import {
    Panel, ListGroup, ListGroupItem, Well
} from 'react-bootstrap';

const PersonsReport = ({ data }) => {
    if (!data) {
        return null;
    }
    return (
        <Well bsSize="small">
            <h4>Persons</h4>
            <ListGroup>
                {
                    Object.entries(data).map(([key, value]) => {
                        const rows = Object.keys(value);
                        return (
                            <ListGroupItem key={key}>
                                <strong>{key}</strong> will be created. Used in rows:
                                <ul>
                                    {rows.map(r => <li key={r}>{r} - in column: {value[r].map(v => `"${v}"`).join(', ')}</li>)}
                                </ul>
                            </ListGroupItem>
                        );
                    })
                }
            </ListGroup>
        </Well>
    )
}

const ImportReport = ({ report }) => {
    return (
        <div id="import-report">
            <Panel bsStyle='info'>
                <Panel.Heading>
                    Import info
                </Panel.Heading>
                <Panel.Body>
                    <PersonsReport data={report.personsReport} />
                </Panel.Body>
            </Panel>
        </div>
    );

};

export default ImportReport;