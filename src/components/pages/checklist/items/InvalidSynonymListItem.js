import React from 'react';

import { Button, Glyphicon } from 'react-bootstrap';

import SynonymListItem from '../../../segments/SynonymListItem';

import config from '../../../../config/config';

const InvalidSynonymListItem = ({
  rowId,
  onChangeToNomenclatoric,
  onChangeToTaxonomic,
  ...props
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
        onClick={() => onChangeToTaxonomic(rowId)}
        title="Change to taxonomic synonym"
      >
        <Glyphicon glyph="share-alt" />{' '}
        {config.mappings.synonym.taxonomic.prefix}
      </Button>
    </>
  );
  return (
    <SynonymListItem
      {...props}
      rowId={rowId}
      prefix={config.mappings.synonym.invalid.prefix}
      additions={Additions}
    />
  );
};

export default InvalidSynonymListItem;
