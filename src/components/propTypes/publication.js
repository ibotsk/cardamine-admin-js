import PropTypes from 'prop-types';


export default {
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    displayType: PropTypes.number.isRequired,
    paperAuthor: PropTypes.string.isRequired,
    paperTitle: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    seriesSource: PropTypes.string,
    volume: PropTypes.number,
    issue: PropTypes.string,
    publisher: PropTypes.string,
    editor: PropTypes.string,
    journalName: PropTypes.string,
    pages: PropTypes.string,
  }),
  defaults: {
    seriesSource: null,
    volume: null,
    issue: null,
    publisher: null,
    editor: null,
    journalName: null,
    pages: null,
  },
};
