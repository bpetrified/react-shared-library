import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';
import React, { forwardRef, useImperativeHandle } from 'react';
import ReactDragListView from 'react-drag-listview';
import { FetchFunction, useFetchData, UseFetchDataResult } from '../hooks/fetch-data-hook';
import { DataTableColumn, useCustomColumn } from '../hooks/custom-column-hook';
import { useRowSelection } from '../hooks/row-selection-hook';
import styles from '../scss/data-table.module.scss';
import { ResizableColumn } from './resizable-column';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export type DataTableRefAttributes = Omit<UseFetchDataResult<any>, 'dataSource' | 'onChange'> & { fetchDataAndReset: () => void, setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>> }

export type DataTableProps<T = any> = {
  columns?: ModifiedTableProps<any>
  /** 
   * Fetch function to get data from BE
   */
  fetchFunction?: FetchFunction<any>
  /** 
   * Initial page size for fetch function to get data from BE
   */
  initialFetchPageSize?: number
  /** 
   * Whether rows can be selectable (checkbox)
   */
  rowSelectionEnabled?: boolean
  /** 
   * Callback when row selection changes
   */
  onRowSelectionChange?: (selectedKeys: React.Key[], seletedRows: T[]) => void;
  /**
   * To reflect new columns when they are changed
   */
  onColumnsChange?: (newColumns: DataTableColumn<T>[]) => void;
} & TableProps<T>;

interface ModifiedTableProps<T> extends TableProps<T> {
  columns?: DataTableColumn<T>[]
}

export const DataTable = forwardRef<DataTableRefAttributes, DataTableProps>((props, ref) => {
  const { columns, setColumn } = useCustomColumn(props.columns || [], props.onColumnsChange || (() => {}))
  const fetchDataHookResult = props.fetchFunction ? useFetchData(props.fetchFunction, props.initialFetchPageSize || 100) : {} as UseFetchDataResult<any>;
  const { rowSelection } = useRowSelection(props.onRowSelectionChange);
  
  // For resetting the filters/sorters/page...
  const [tableKey, setTableKey] = useState(0);
  const fetchDataAndReset = () => {
    fetchDataHookResult.clearSortersAndPagination();
    setTableKey(tableKey => tableKey + 1);
  };

  const changePageConfig = (pageConfig: TablePaginationConfig) => {
    fetchDataHookResult.changePageConfig(pageConfig);
    setTableKey(tableKey => tableKey + 1);
  };

  /*
  * Expose ref methods to parent, so the parent can have some control.
  */
  useImperativeHandle(ref, () => {
    const { dataSource, onChange, ...rest } = fetchDataHookResult;
    return { ...rest, fetchDataAndReset, changePageConfig, setSelectedRowKeys: rowSelection.setSelectedRowKeys };
  });

  return (
    <DndProvider backend={HTML5Backend}>
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
          key={tableKey}
          {...fetchDataHookResult as any}
          {...props}
          rowSelection={props.rowSelectionEnabled ? rowSelection : undefined}
          className={`${styles.dataTable} ${props.className}`}
          // Pagination config from props
          pagination={props.pagination != false ? { ...fetchDataHookResult.pagination, ...props.pagination } : props.pagination}
          columns={columns}
          components={{
            header: {
              cell: (_props: any) => { 
                // Disable drag on select columns...
                return (_props.index === undefined && props.rowSelectionEnabled) ? <th {..._props} data-testid={`id-col-header-${_props.index}`}>{_props.children}</th> : <ResizableColumn {..._props}/>; },
            },
          }}
        />
      </ReactDragListView.DragColumn>
      
    </>
    </DndProvider>
  );
});

