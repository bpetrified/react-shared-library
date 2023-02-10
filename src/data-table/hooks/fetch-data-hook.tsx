import { TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';

export type FetchFunction<T> = (pagination: TablePaginationConfig, sorters: SorterResult<any>[]) => Promise<{ data: T[], pagination: TablePaginationConfig }>

type TableParams = {
  pagination: TablePaginationConfig;
  sorters: SorterResult<any>[];
  // For on page search...
  filters?: Record<string, FilterValue | null>;
}

export type UseFetchDataResult<T> = {
  dataSource?: T[];
  loading: boolean;
  onChange: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<T> | SorterResult<T>[]) => void;
  pagination: TablePaginationConfig;
  fetchData: () => Promise<void>;
  sorters: SorterResult<any>[];
  isFetchError: boolean;
}

export function useFetchData<T>(fetchFunction: FetchFunction<T>): UseFetchDataResult<T> {
  const [data, setData] = useState<T[]>();
  const [loading, setLoading] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {},
    sorters: []
  });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    // filters will be on page search coming from "data-table"
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => {
    /*
    * When on page search changed (filters changed), pagination.current always = 1.
    * so we need to update only filters, when filters changed
    */
    const filtersChanged = isFiltersChanged(tableParams.filters, filters);
    if (filtersChanged) {
      setTableParams({
        ...tableParams,
        filters
      });
    } else {
      setTableParams({
        pagination,
        filters,
        sorters: (sorter as SorterResult<T>[]).length ? (sorter as SorterResult<T>[]) : [sorter as SorterResult<T>],
      });
    }
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const fetchData = async () => {
    if (!!!fetchFunction)
      return;
    try {
      setLoading(true);
      const fetchResult = await fetchFunction(tableParams.pagination, tableParams.sorters)
      setIsFetchError(false);
      setData(fetchResult.data);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          current: fetchResult.pagination.current,
          total: fetchResult.pagination.total,
          pageSize: fetchResult.pagination.pageSize
        },
      });
    } catch (e) {
      setIsFetchError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify({
    pagination: {
      current: tableParams.pagination.current,
      total: tableParams.pagination.total,
      pageSize: tableParams.pagination.pageSize
    }, sorters: tableParams.sorters
  })]);

  return { dataSource: data, loading, onChange: handleTableChange, pagination: tableParams.pagination, fetchData, sorters: tableParams.sorters, isFetchError }
}

const isFiltersChanged = (currentFilters: any, newFilters: any) => {
  return JSON.stringify(currentFilters) != JSON.stringify(newFilters);
}