import React from 'react';

import {
  Form, FormGroup, FormControl, Button,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import config from '../../../config';

const { constants } = config;

class LatLonCellEditRenderer extends React.Component {
  constructor(props) {
    super(props);
    const { value = { lat: '', lon: '' } } = props;

    this.state = {
      lat: value.lat,
      lon: value.lon,
    };
  }

  getValue() {
    const { lat, lon } = this.state;
    if (!lat || !lon) {
      return undefined;
    }
    return { lat, lon };
  }

  render() {
    const { onUpdate } = this.props;
    const { lat, lon } = this.state;
    return (
      <Form inline key="mapCoordinatesForm">
        <FormGroup controlId="lat">
          <FormControl
            type="text"
            bsSize="small"
            placeholder="latitude"
            value={lat}
            onChange={(e) => this.setState({ lat: e.target.value })}
            pattern={constants.regexLatitude}
          />
        </FormGroup>
        {' '}
        <FormGroup controlId="lon">
          <FormControl
            type="text"
            bsSize="small"
            placeholder="longitude"
            value={lon}
            onChange={(e) => this.setState({ lon: e.target.value })}
            pattern={constants.regexLongitude}
          />
        </FormGroup>
        {' '}
        <Button
          key="submit"
          bsSize="small"
          bsStyle="primary"
          onClick={() => onUpdate(this.getValue())}
        >
          Save
        </Button>
      </Form>
    );
  }
}

export default LatLonCellEditRenderer;

LatLonCellEditRenderer.propTypes = {
  value: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }),
  onUpdate: PropTypes.func.isRequired,
};

LatLonCellEditRenderer.defaultProps = {
  value: undefined,
};
