import { Table } from 'antd';
import { TableProps } from 'antd/es/table';
import React, { forwardRef, useImperativeHandle } from 'react';
import ReactDragListView from 'react-drag-listview';
import { FetchFunction, useFetchData, UseFetchDataResult } from '../hooks/fetch-data-hook';
import { DataTableColumn, useCustomColumn } from '../hooks/custom-column-hook';
import { useRowSelection } from '../hooks/row-selection-hook';
import styles from '../scss/data-table.module.scss';
import { ResizableColumnTitle } from './resizable-column-title';

export type DataTableRefAttributes = Omit<UseFetchDataResult<any>, 'dataSource' | 'onChange'>

export type DataTableProps<T = any> = {
  columns?: ModifiedTableProps<any>
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
} & TableProps<T>;

interface ModifiedTableProps<T> extends TableProps<T> {
  columns?: DataTableColumn<T>[]
}

export const DataTable = forwardRef<DataTableRefAttributes, DataTableProps>((props, ref) => {
  const { columns, setColumn } = useCustomColumn(props.columns || [])
  const fetchDataHookResult = props.fetchFunction ? useFetchData(props.fetchFunction) : {} as UseFetchDataResult<any>;
  const { rowSelection } = useRowSelection(props.onRowSelectionChange);
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
          const hasCheckboxColumn = !!props.rowSelectionEnabled;
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
        }
        handleSelector={'.dragHandler'}
        ignoreSelector={"react-resizable-handle"}
      >
        <Table
          {...fetchDataHookResult as any}
          rowSelection={props.rowSelectionEnabled ? rowSelection : undefined}
          {...props}
          className={`${styles.dataTable} ${props.className}`}
          // Pagination config from props
          pagination={props.pagination != false ? { ...fetchDataHookResult.pagination, ...props.pagination } : props.pagination}
          columns={columns}
          components={{
            header: {
              cell: ResizableColumnTitle,
            },
          }}
        />
      </ReactDragListView.DragColumn>
    </>
  );
});

