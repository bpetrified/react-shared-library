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
  clearSortersAndPagination: () => void;
  changePageConfig: (pageConfig: TablePaginationConfig) => void;
}

export function useFetchData<T>(fetchFunction: FetchFunction<T>, initialPageSize: number): UseFetchDataResult<T> {
  const [data, setData] = useState<T[]>();
  const [loading, setLoading] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: initialPageSize,
    },
    filters: {},
    sorters: []
  });

  const clearSortersAndPagination = () => {
    setTableParams({
      ...tableParams, sorters: [], pagination: {
        // If already at page 1, and no sorters, changing to page 1 will not trigger useEffect change...
        current: (tableParams.pagination.current === 1 && tableParams.sorters.length === 0) ? 0 : 1,
        pageSize: initialPageSize,
      }
    });
  }

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

  const changePageConfig = ({ current }: TablePaginationConfig) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current
      },
    });
  };

  const fetchData = async () => {
    if (!!!fetchFunction)
      return;
    try {
      setLoading(true);
      const fetchResult = await fetchFunction({
        ...tableParams.pagination,
        current: tableParams.pagination.current || 1
      }, tableParams.sorters);
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
      pageSize: tableParams.pagination.pageSize
    }, sorters: tableParams.sorters
  })]);

  return { dataSource: data, loading, onChange: handleTableChange, pagination: tableParams.pagination, fetchData, sorters: tableParams.sorters, isFetchError, clearSortersAndPagination, changePageConfig }
}

const isFiltersChanged = (currentFilters: any, newFilters: any) => {
  return JSON.stringify(currentFilters) != JSON.stringify(newFilters);
}