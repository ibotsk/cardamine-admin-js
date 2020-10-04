import { helperUtils } from '../../utils';

const LosName = ({ data, format = 'plain' }) => {
  if (!data) {
    return '';
  }
  return helperUtils.listOfSpeciesForComponent(data, format);
};

export default LosName;
