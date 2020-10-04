import React from 'react';
import { Panel } from 'react-bootstrap';

const CoordinatesWidget = () => (
  <Panel>
    <Panel.Heading>Coordinates</Panel.Heading>
    <Panel.Body>
      <p>
        1. To resolve - if material does not have georeferenced coordinates
        and it was not possible to convert originals into decadic for map
        automatically
      </p>
      <p>
        2. Give info about how many records have coordinates for map,
        how many do not.
      </p>
    </Panel.Body>
  </Panel>
);

export default CoordinatesWidget;
