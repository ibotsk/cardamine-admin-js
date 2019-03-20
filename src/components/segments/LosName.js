
import helper from '../../utils/helper';

const LosName = props => {

    const name = props.data;
    if (!name) {
        return '';
    }

    const format = props.format || 'plain';

    return helper.listOfSpeciesForComponent(name, format);

}

export default LosName;