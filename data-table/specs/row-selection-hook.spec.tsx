import { render } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import { useRowSelection } from '../hooks/row-selection-hook';

describe('Row Selecion Hook Test', () => {
  it('on row selection changed should set selected rows', () => {
    const TestComponent = () => {
      const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
      const { rowSelection } = useRowSelection((selectedKeys) => {
        setSelectedRows(selectedKeys);
      });
    
      useEffect(() => {
        rowSelection.onChange(['a','b'], [{}, {}]);
      }, []);
    
      return <>
      <div>{selectedRows.join(',')}</div>
      </>
    }

    const { getByText } = render(<TestComponent/>);
    const rendered = getByText('a,b');
    expect(rendered).toBeTruthy();
  });

  it('on row selection changed should set selected rows, when "onRowSelectionChange" not provided', () => {
    const TestComponent = () => {
      const [selectedRows ] = useState<React.Key[]>(['c','d']);
      const { rowSelection } = useRowSelection();
    
      useEffect(() => {
        rowSelection.onChange(['a','b'], [{}, {}]);
      }, []);
    
      return <>
      <div>{selectedRows.join(',')}</div>
      </>
    }
    const { getByText } = render(<TestComponent/>);
    const rendered = getByText('c,d');
    expect(rendered).toBeTruthy();
  });
})

