import React from 'react';
import { useState } from 'react';

export function useRowSelection(onRowSelectionChange?: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => void) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onRowSelectionChange?.(newSelectedRowKeys, newSelectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  return { rowSelection };
}