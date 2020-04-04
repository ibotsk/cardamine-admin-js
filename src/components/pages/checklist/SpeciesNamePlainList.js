import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import LosName from '../../segments/LosName';

const SpeciesNamePlainList = ({ list }) => {

  if (!list || list.length === 0) {
    return <ListGroupItem />
  }
  return (
    <ListGroup>
      {list.map(species =>
        <ListGroupItem key={species.id}>
          <LosName data={species} />
        </ListGroupItem>)}
    </ListGroup>
  );

};

export default SpeciesNamePlainList;