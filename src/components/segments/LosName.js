
import helper from '../../utils/helper';

const LosName = (props) => {

    const name = props.data;
    if (!name) {
        return '';
    }

    return helper.listOfSpeciesForComponent(name, props.format);

}

export default LosName;