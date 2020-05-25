import helper from '../../utils/helper';

const LosName = ({ data, format = 'plain' }) => {
  if (!data) {
    return '';
  }
  return helper.listOfSpeciesForComponent(data, format);
};

export default LosName;
