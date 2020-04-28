import React from 'react';

import { Button, Glyphicon } from 'react-bootstrap';

import SynonymListItem from '../../../segments/SynonymListItem';

import config from '../../../../config/config';

const InvalidSynonymListItem = ({
  rowId,
  data,
  onRowDelete,
  onChangeToNomenclatoric,
  onChangeToTaxonomic,
}) => {
  const Additions = () => (
    <>
      <Button
        bsStyle="primary"
        bsSize="xsmall"
        onClick={() => onChangeToNomenclatoric(rowId)}
        title="Change to nomenclatoric synonym"
      >
        <Glyphicon glyph="share-alt" />
        {' '}
        {config.mappings.synonym.nomenclatoric.prefix}
      </Button>
      &nbsp;
      <Button
        bsStyle="primary"
        bsSize="xsmall"
        onClick={() => onChangeToTaxonomic(rowId)}
        title="Change to taxonomic synonym"
      >
        <Glyphicon glyph="share-alt" />
        {' '}
        {config.mappings.synonym.taxonomic.prefix}
      </Button>
    </>
  );
  return (
    <SynonymListItem
      rowId={rowId}
      data={data}
      prefix={config.mappings.synonym.invalid.prefix}
      additions={Additions}
      showSubNomenclatoric={false}
      onRowDelete={onRowDelete}
    />
  );
};

export default InvalidSynonymListItem;
