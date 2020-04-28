import React from 'react';
import {
  Panel, ListGroup, ListGroupItem, Well, Badge,
} from 'react-bootstrap';

const infoReportCategory = (data, label) => {
  if (!data) {
    return {
      content: null,
      count: 0,
    };
  }
  const nonEmptyKeysEntries = Object.entries(data).filter(
    ([key]) => key !== '',
  );

  const nonEmptyKeysEntriesLength = nonEmptyKeysEntries.length;
  if (nonEmptyKeysEntriesLength === 0) {
    return {
      content: null,
      count: 0,
    };
  }

  return {
    content: (
      <Well bsSize="small">
        <h4>
          {label}
          {' '}
          <Badge>{nonEmptyKeysEntriesLength}</Badge>
        </h4>
        <ListGroup>
          {nonEmptyKeysEntries.map(([key, value]) => {
            const rows = Object.keys(value);
            return (
              <ListGroupItem key={key}>
                <strong>{key}</strong>
                {' '}
                - used in rows:
                {Array.isArray(value) ? (
                  ` ${value.join(', ')} `
                ) : (
                  <ul>
                    {rows.map((r) => (
                      <li key={r}>
                        {r}
                        {' '}
                        - in column:
                        {' '}
                        {value[r].map((v) => `"${v}"`).join(', ')}
                      </li>
                    ))}
                  </ul>
                )}
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </Well>
    ),
    count: nonEmptyKeysEntriesLength,
  };
};

const warningsReport = (speciesReport, publicationReport) => {
  if (!speciesReport && !publicationReport) {
    return {
      content: null,
      count: 0,
    };
  }
  const emptySpecies = speciesReport[''];
  const emptyPublication = publicationReport[''];

  if (!emptySpecies && !emptyPublication) {
    return {
      content: null,
      count: 0,
    };
  }

  const count = (emptySpecies ? emptySpecies.length : 0)
    + (emptyPublication ? emptyPublication.length : 0);
  return {
    content: (
      <ListGroup>
        {emptySpecies && (
          <ListGroupItem>
            <strong>Standard name</strong>
            {' '}
            empty in rows:
            {' '}
            {emptySpecies.join(', ')}
          </ListGroupItem>
        )}
        {emptyPublication && (
          <ListGroupItem>
            <strong>Publication</strong>
            {' '}
            empty in rows:
            {' '}
            {emptyPublication.join(', ')}
          </ListGroupItem>
        )}
      </ListGroup>
    ),
    count,
  };
};

const ReportPanel = ({
  panelClass, label, count = 0, children,
}) => (
  <Panel bsStyle={panelClass}>
    <Panel.Heading>
      <Panel.Title componentClass="h4" toggle>
        {label}
        {' '}
        {count !== undefined && <Badge>{count}</Badge>}
      </Panel.Title>
    </Panel.Heading>
    <Panel.Collapse>
      <Panel.Body>{children}</Panel.Body>
    </Panel.Collapse>
  </Panel>
);

const ImportReport = ({ report }) => {
  const { speciesReport, publicationReport, personsReport } = report;
  const { content: warnings, count: warningsCount } = warningsReport(
    speciesReport,
    publicationReport,
  );

  const { content: infoPersons, count: infoCountPersons } = infoReportCategory(
    personsReport,
    'Persons to be created',
  );
  const { content: infoSpecies, count: infoCountSpecies } = infoReportCategory(
    speciesReport,
    'Species to be created',
  );
  const {
    content: infoPublication,
    count: infoCountPublication,
  } = infoReportCategory(publicationReport, 'Publications to be created');

  const infoCount = infoCountPersons + infoCountSpecies + infoCountPublication;

  return (
    <div id="import-report">
      <ReportPanel panelClass="warning" label="Warnings" count={warningsCount}>
        {warnings}
      </ReportPanel>

      <ReportPanel panelClass="info" label="Import info" count={infoCount}>
        {infoPersons}
        {infoSpecies}
        {infoPublication}
      </ReportPanel>
    </div>
  );
};

export default ImportReport;
