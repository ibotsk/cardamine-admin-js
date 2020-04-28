import React from 'react';

import { ControlLabel, FormControl, FormGroup, Col } from 'react-bootstrap';

import SynonymListItem from '../../../segments/SynonymListItem';

import config from '../../../../config/config';

const MisidentifiedSynonymListItem = ({
  rowId,
  onChangeAuthor,
  data,
  onRowDelete,
}) => {
  const { misidentificationAuthor } = data;
  return (
    <SynonymListItem
      rowId={rowId}
      data={data}
      prefix={config.mappings.synonym.misidentification.prefix}
      showSubNomenclatoric={false}
      onRowDelete={onRowDelete}
    >
      <FormGroup bsSize="sm">
        <Col componentClass={ControlLabel} sm={2}>
          Author:
        </Col>
        <Col xs={8}>
          <FormControl
            type="text"
            value={misidentificationAuthor || ''}
            placeholder="Misidentification Author"
            onChange={(e) => onChangeAuthor(rowId, e.target.value)}
          />
        </Col>
      </FormGroup>
    </SynonymListItem>
  );
};

export default MisidentifiedSynonymListItem;
