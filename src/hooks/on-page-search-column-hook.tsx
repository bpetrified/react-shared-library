import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, InputRef, Space } from 'antd';
import { ColumnType } from 'antd/es/table';
import { FilterConfirmProps } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";

export interface DataTableColumn<T> extends ColumnType<T> {
  onPageSearchEnabled?: boolean
}

type SearchedColumns = {
  [key: string]: string
}

export function useOnPageSearchColumn<T>(originalColumns: ColumnType<T>[]) {
  const [columns, setColumn] = useState<DataTableColumn<T>[]>(originalColumns || []);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  // Track searching columns...
  const searchedColumnsRef = useRef<SearchedColumns>({})
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: string,
  ) => {
    confirm();
    searchedColumnsRef.current = {
      ...searchedColumnsRef.current,
      [dataIndex]: selectedKeys[0]
    }
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void, dataIndex: string) => {
    delete searchedColumnsRef.current[dataIndex];
    clearFilters?.();
    setSearchText('');
    setSearchedColumn(dataIndex)
  };

  const getColumnSearchProps = (dataIndex: string): ColumnType<T> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          data-testid={`search-input-${dataIndex}`}
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => { 
            const _selectedKey = e.target.value ? [e.target.value] : [];
            setSelectedKeys(_selectedKey)
          }}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            data-testid={`search-btn-${dataIndex}`}
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            data-testid={`reset-btn-${dataIndex}`}
            onClick={() => { 
              handleReset(clearFilters || (() => {}), dataIndex);
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            data-testid={`close-btn-${dataIndex}`}
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined data-testid={`filter-icon-${dataIndex}`} style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record: any) => {
      return record[dataIndex]
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase())
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    }
  });

  /** Add enhance property for searchable column... */
  useEffect(() => {
    setColumn(columns.map((col) => {
      const onPageSearchProperty = col.onPageSearchEnabled ? getColumnSearchProps((col.dataIndex || '').toString()) : {};
      return {
        ...col,
        ...onPageSearchProperty
      }
    }))
  }, []);

  return { columns, setColumn }
}