import { Table } from 'antd';
import { TableProps } from 'antd/es/table';
import React, { forwardRef, useImperativeHandle } from 'react';
import ReactDragListView from 'react-drag-listview';
import { FetchFunction, useFetchData, UseFetchDataResult } from '../hooks/fetch-data-hook';
import { DataTableColumn, useOnPageSearchColumn } from '../hooks/on-page-search-column-hook';
import { useRowSelection } from '../hooks/row-selection-hook';

export type DataTableRefAttributes = Omit<UseFetchDataResult<any>, 'dataSource' | 'onChange'>

export type DataTableProps = {
  /** 
   * antd table props to control the table
   */
  antdTableProps?: ModifiedTableProps<any>
  /** 
   * Fetch function to get data from BE
   */
  fetchFunction?: FetchFunction<any>
  /** 
   * Whether rows can be selectable (checkbox)
   */
  rowSelectionEnabled?: boolean
  /** 
   * Callback when row selection changes
   */
  onRowSelectionChange?: (selectedKeys: React.Key[]) => void;
};

interface ModifiedTableProps<T> extends TableProps<T> {
  columns?: DataTableColumn<T>[]
}


export const DataTable = forwardRef<DataTableRefAttributes, DataTableProps>(({ antdTableProps = {}, fetchFunction, rowSelectionEnabled, onRowSelectionChange}, ref) => {
  const { columns, setColumn } = useOnPageSearchColumn(antdTableProps.columns || [])
  const fetchDataHookResult  = fetchFunction ? useFetchData(fetchFunction) : {} as UseFetchDataResult<any>;
  const { rowSelection } = useRowSelection(onRowSelectionChange);

  /*
  * Expose ref methods to parent, so the parent can have some control.
  */
  useImperativeHandle(ref, () => {
    const { dataSource, onChange, ...rest } = fetchDataHookResult;
    return rest;
  });

  return (
    <>
      {/* Ignore here as unable to fix React type version conflict T.T */}
      {/* @ts-ignore */}
      <ReactDragListView.DragColumn
        nodeSelector={"th"}
        onDragEnd={(fromIndex, toIndex) => {
          // Handling checkbox table...
          const hasCheckboxColumn = !!rowSelectionEnabled;
          if (hasCheckboxColumn && fromIndex == 0) {
            return;
          }
          let _fromIndex = hasCheckboxColumn ? fromIndex - 1 : fromIndex;
          let _toIndex = hasCheckboxColumn ? toIndex - 1 : toIndex;
          const newColumns = [...columns];
          const item = newColumns.splice(_fromIndex, 1)[0];
          newColumns.splice(_toIndex, 0, item);
          setColumn(newColumns);
        }
        }>
        <Table
          {...fetchDataHookResult as any}
          rowSelection={rowSelectionEnabled ? rowSelection : undefined}
          {...antdTableProps}
          // Pagination config from "antdTableProps"
          pagination={antdTableProps.pagination != false ? {...fetchDataHookResult.pagination, ...antdTableProps.pagination} : antdTableProps.pagination}
          columns={columns}
        />
      </ReactDragListView.DragColumn>
    </>
  );
});
