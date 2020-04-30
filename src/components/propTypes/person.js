import PropTypes from 'prop-types';

export default {
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    persName: PropTypes.string.isRequired,
  }),
};
