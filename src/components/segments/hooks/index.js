import { useCallback, useEffect, useState } from 'react';

import { tablesFacade } from '../../../facades';
import { filterUtils, whereUtils } from '../../../utils';

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
    let cancelled = false;

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

      if (!cancelled) {
        setTotalSize(size);
        setData(records);
        setLoading(false);
      }
    };

    fetch();

    return () => { cancelled = true; };
  }, [countUri, getAllUri, accessToken, whereString,
    page, limit, orderString, forceChange]);

  return {
    data,
    totalSize,
    isLoading,
  };
}

function useTableChange({
  pageInit = 1,
  sizePerPageInit = sizePerPageDefault,
  whereInit = undefined,
  orderInit = undefined,
} = {}) {
  const [page, setPage] = useState(pageInit);
  const [sizePerPage, setSizePerPage] = useState(sizePerPageInit);
  const [where, setWhere] = useState(whereInit);
  const [order, setOrder] = useState(orderInit);

  const setValues = ({
    page: pageNew,
    sizePerPage: sizePerPageNew,
    filters,
    sortField,
    sortOrder,
    prefix = '', // group of columns
    defaultOrderField = undefined,
  }) => {
    const curatedFilters = filterUtils.curateSearchFilters(filters);
    const newWhere = whereUtils.makeWhereFromFilter(curatedFilters);

    const curatedSortField = filterUtils.curateSortFields(sortField, prefix);
    const newOrder = filterUtils.makeOrder(
      curatedSortField, sortOrder, defaultOrderField,
    );
    // some tables might not have pagination
    // for undefined page and sizePerPage use default or initialized values
    setPage(pageNew || pageInit);
    setSizePerPage(sizePerPageNew || sizePerPageInit);
    setOrder(JSON.stringify(newOrder));
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

/**
 * Running fetchFunction with isLoading state
 * @param {function} fetchFunction
 */
function useSimpleFetch(fetchFunction) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const doFetch = useCallback(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      const records = await fetchFunction();

      if (!cancelled) {
        setData(records);
        setLoading(false);
      }
    };

    fetch();

    return () => { cancelled = true; };
  }, [fetchFunction]);

  return {
    data,
    isLoading,
    doFetch,
  };
}

export default {
  useTableData,
  useTableChange,
  useSimpleFetch,
};
