import { useEffect, useState } from 'react';

import { tablesFacade } from '../../../facades';
import { whereUtils } from '../../../utils';

import config from '../../../config';

const { pagination: { sizePerPageList } } = config;
const sizePerPageDefault = sizePerPageList[0].value;

/**
 * @param {string} countUri
 * @param {string} getAllUri
 * @param {string} accessToken
 * @param {string} whereString
 * @param {number} page
 * @param {number} limit
 * @param {string} orderString
 * @param {string|number|boolean} forceChange any primitive
 */
function useTableData(
  countUri, getAllUri, accessToken, whereString, page, limit,
  orderString, forceChange,
) {
  const [isLoading, setLoading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const size = await tablesFacade.getCount(
        countUri, whereString, accessToken,
      );

      const lim = limit || size; // use all records if limit is undefined
      const offset = (page - 1) * limit;

      const records = await tablesFacade.getAll(
        getAllUri, offset, whereString, orderString, lim, accessToken,
      );

      setTotalSize(size);
      setData(records);
      setLoading(false);
    };

    fetch();
  },
  [countUri, getAllUri, accessToken, whereString,
    page, limit, orderString, forceChange]);

  return {
    data,
    totalSize,
    isLoading,
  };
}

function useTableChange(
  pageInit = 1, sizePerPageInit = sizePerPageDefault,
) {
  const [page, setPage] = useState(pageInit);
  const [sizePerPage, setSizePerPage] = useState(sizePerPageInit);
  const [where, setWhere] = useState(undefined);
  const [order, setOrder] = useState(undefined);

  const setValues = ({
    page: pageNew,
    sizePerPage: sizePerPageNew,
    filters,
    sortField,
    sortOrder,
  }) => {
    // const curatedFilters = filterUtils.curateSearchFilters(
    //   filters, { ownerId },
    // );
    const newWhere = whereUtils.makeWhereFromFilter(filters);

    // const curatedSortField = filterUtils.curateSortFields(sortField);
    // const newOrder = helperUtils.makeOrder(curatedSortField, sortOrder);

    // some tables might not have pagination
    // for undefined page and sizePerPage use default or initialized values
    setPage(pageNew || pageInit);
    setSizePerPage(sizePerPageNew || sizePerPageInit);
    // setOrder(JSON.stringify(newOrder));
    setWhere(JSON.stringify(newWhere));
  };

  return {
    page,
    sizePerPage,
    where,
    order,
    setValues,
  };
}

export default {
  useTableData,
  useTableChange,
};
