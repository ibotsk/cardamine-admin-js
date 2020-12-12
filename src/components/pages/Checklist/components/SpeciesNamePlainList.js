import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import PropTypes from 'prop-types';

import LosName from '../../../segments/LosName';

const SpeciesNamePlainList = ({ list = [] }) => {
  if (!list || list.length === 0) {
    return <ListGroupItem />;
  }
  return (
    <ListGroup>
      {list.map((species) => (
        <ListGroupItem key={species.id}>
          <LosName data={species} />
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

export default SpeciesNamePlainList;

SpeciesNamePlainList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    genus: PropTypes.string,
    species: PropTypes.string,
    authors: PropTypes.string,
  })),
};

SpeciesNamePlainList.defaultProps = {
  list: [],
};
