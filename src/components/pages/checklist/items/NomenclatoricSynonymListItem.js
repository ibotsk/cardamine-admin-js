import React from 'react';

import { Button, Glyphicon } from 'react-bootstrap';

import SynonymListItem from '../../../segments/SynonymListItem';

import config from '../../../../config/config';

const NomenclatoricSynonymListItem = ({
  rowId,
  onChangeToTaxonomic,
  onChangeToInvalid,
  ...props
}) => {
  const Additions = () => (
    <>
      <Button
        bsStyle="primary"
        bsSize="xsmall"
        onClick={() => onChangeToTaxonomic(rowId)}
        title="Change to taxonomic synonym"
      >
        <Glyphicon glyph="share-alt" />{' '}
        {config.mappings.synonym.taxonomic.prefix}
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
      {...props}
      rowId={rowId}
      prefix={config.mappings.synonym.nomenclatoric.prefix}
      additions={Additions}
    />
  );
};

export default NomenclatoricSynonymListItem;
