import PropTypes from 'prop-types';

import SpeciesType from './species';

export default {
  type: PropTypes.shape({
    id: PropTypes.number,
    misidentificationAuthor: PropTypes.string,
    synonym: SpeciesType.type,
  }),
  defaults: {
    id: undefined,
    misidentificationAuthor: null,
    synonym: undefined,
  },
};
