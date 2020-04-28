import React from 'react';

import { Button, Glyphicon } from 'react-bootstrap';

import SynonymListItem from '../../../segments/SynonymListItem';

import config from '../../../../config/config';

const TaxonomicSynonymListItem = ({
  rowId,
  data,
  onRowDelete,
  onChangeToNomenclatoric,
  onChangeToInvalid,
}) => {
  const Additions = () => (
    <>
      <Button
        bsStyle="primary"
        bsSize="xsmall"
        onClick={() => onChangeToNomenclatoric(rowId)}
        title="Change to nomenclatoric synonym"
      >
        <Glyphicon glyph="share-alt" />{' '}
        {config.mappings.synonym.nomenclatoric.prefix}
      </Button>
      &nbsp;
      <Button
        bsStyle="primary"
        bsSize="xsmall"
        onClick={() => onChangeToInvalid(rowId)}
        title="Change to invalid designation"
      >
        <Glyphicon glyph="share-alt" /> {config.mappings.synonym.invalid.prefix}
      </Button>
    </>
  );
  return (
    <SynonymListItem
      rowId={rowId}
      data={data}
      prefix={config.mappings.synonym.taxonomic.prefix}
      additions={Additions}
      showSubNomenclatoric={false}
      onRowDelete={onRowDelete}
    />
  );
};

export default TaxonomicSynonymListItem;
