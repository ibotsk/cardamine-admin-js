import React from 'react';

import {
  Form, FormGroup, FormControl, Button,
  Tooltip, OverlayTrigger,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import { validationUtils } from '../../../utils';
import config from '../../../config';

const { getValidationLatitudeDec, getValidationLongitudeDec } = validationUtils;
const { constants } = config;

const tooltip = (
  <Tooltip id="tooltip">
    Must be a number with decimal point (e.g. 18.1234)
  </Tooltip>
);

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

  handleUpdate = () => {
    const { lat, lon } = this.state;
    if (getValidationLatitudeDec(lat, lon) === 'success'
      && getValidationLongitudeDec(lon, lat) === 'success') {
      const { onUpdate } = this.props;
      onUpdate(this.getValue());
    }
  }

  render() {
    const { lat, lon } = this.state;
    return (
      <Form inline key="mapCoordinatesForm">
        <OverlayTrigger placement="top" overlay={tooltip}>
          <FormGroup
            controlId="lat"
            validationState={getValidationLatitudeDec(lat, lon)}
            bsSize="small"
          >
            <FormControl
              type="text"
              bsSize="small"
              placeholder="latitude"
              value={lat}
              onChange={(e) => this.setState({ lat: e.target.value })}
              pattern={constants.regexLatitude}
            />
          </FormGroup>
        </OverlayTrigger>
        {' '}
        <OverlayTrigger placement="top" overlay={tooltip}>
          <FormGroup
            controlId="lon"
            validationState={getValidationLongitudeDec(lon, lat)}
            bsSize="small"
          >
            <FormControl
              type="text"
              bsSize="small"
              placeholder="longitude"
              value={lon}
              onChange={(e) => this.setState({ lon: e.target.value })}
              pattern={constants.regexLongitude}
            />
          </FormGroup>
        </OverlayTrigger>
        {' '}
        <Button
          key="submit"
          bsSize="small"
          bsStyle="primary"
          onClick={this.handleUpdate}
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
