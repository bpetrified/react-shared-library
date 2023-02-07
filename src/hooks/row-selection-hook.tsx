import React from 'react';
import { useState } from 'react';

export function useRowSelection(onRowSelectionChange?: (newSelectedRowKeys: React.Key[]) => void) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onRowSelectionChange?.(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  return { rowSelection };
}