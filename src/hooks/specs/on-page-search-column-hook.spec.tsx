import { act, fireEvent, getByTestId, render, waitFor } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import { useOnPageSearchColumn } from '../on-page-search-column-hook';
import { useRowSelection } from '../row-selection-hook';

describe('On Page Search Column Hook Test', () => {
  it('on search click should execute confirm()', async () => {
    const sampleColumns = [
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
        onPageSearchEnabled: true
      }
    ];
    const args = {
      setSelectedKeys: jest.fn(),
      selectedKeys: [],
      confirm: jest.fn(),
      clearFilters: jest.fn(),
      close: jest.fn()
    }
    const TestComponent = () => {
      const { columns } = useOnPageSearchColumn<any>(sampleColumns);
      return <>
      {columns[1].filterDropdown ? (columns[1] as any).filterDropdown(args) : null}
      </>
    }

    const { getByTestId } = render(<TestComponent/>);
    const searchButton = getByTestId('search-btn-name');
    fireEvent.click(searchButton);
    expect(args.confirm).toBeCalled();
  });

  it('on reset click should execute clearFilter()', async () => {
    const sampleColumns = [
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
        onPageSearchEnabled: true
      }
    ];
    const args = {
      setSelectedKeys: jest.fn(),
      selectedKeys: [],
      confirm: jest.fn(),
      clearFilters: jest.fn(),
      close: jest.fn()
    }
    const TestComponent = () => {
      const { columns } = useOnPageSearchColumn(sampleColumns);
      return <>
      {columns[1].filterDropdown ? (columns[1] as any).filterDropdown(args) : null}
      </>
    }

    const { getByTestId } = render(<TestComponent/>);
    const resetButton = getByTestId('reset-btn-name');
    fireEvent.click(resetButton);
    expect(args.clearFilters).toBeCalled();
  });

  it('"onFilter" should filter result', async () => {
    const sampleColumns = [
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
        onPageSearchEnabled: true
      }
    ];
    
    const TestComponent = () => {
      const { columns } = useOnPageSearchColumn(sampleColumns);
      return <>
      {columns[1].onFilter ? <span>{
        columns[1].onFilter('a', { name: 'ab'}) ? 'true' : 'false'
      }</span> : null}
      </>
    }

    const { getByText } = render(<TestComponent/>);
    const rendered = getByText('true');
    expect(rendered).toBeInTheDocument();
  });

  it('onFilterDropdownOpenChange run through..', async () => {
    jest.useFakeTimers();
    const sampleColumns = [
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
        onPageSearchEnabled: true
      }
    ];
    
    const args = {
      setSelectedKeys: jest.fn(),
      selectedKeys: [],
      confirm: jest.fn(),
      clearFilters: jest.fn(),
      close: jest.fn()
    }

    const TestComponent = () => {
      const { columns } = useOnPageSearchColumn(sampleColumns);
      useEffect(() => {
        if(columns[1].onFilterDropdownOpenChange) {
          columns[1].onFilterDropdownOpenChange(true);
        }
      }, [columns])
      return <>
        {columns[1].filterDropdown ? (columns[1] as any).filterDropdown(args) : null}
      </>
    }

    const { getByTestId } = render(<TestComponent/>);
    act(() => {
      jest.runAllTimers(); // trigger setTimeout
    });
    const resetButton = getByTestId('reset-btn-name');
    expect(resetButton).toBeInTheDocument();
  });

  it('on enter in search input should execute confirm()', async () => {
    const sampleColumns = [
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
        onPageSearchEnabled: true
      }
    ];
    const args = {
      setSelectedKeys: jest.fn(),
      selectedKeys: [],
      confirm: jest.fn(),
      clearFilters: jest.fn(),
      close: jest.fn()
    }
    const TestComponent = () => {
      const { columns } = useOnPageSearchColumn(sampleColumns);
      return <>
      {columns[1].filterDropdown ? (columns[1] as any).filterDropdown(args) : null}
      </>
    }

    const { getByTestId } = render(<TestComponent/>);
    const input = getByTestId('search-input-name');
    fireEvent.change(input, {target: {value: 'test'}});
    fireEvent.keyDown(input, { keyCode: 13 });
    expect(args.confirm).toBeCalled();
  });

  it('on close button clicked should execute close()', async () => {
    const sampleColumns = [
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
        onPageSearchEnabled: true
      }
    ];
    const args = {
      setSelectedKeys: jest.fn(),
      selectedKeys: [],
      confirm: jest.fn(),
      clearFilters: jest.fn(),
      close: jest.fn()
    }
    const TestComponent = () => {
      const { columns } = useOnPageSearchColumn(sampleColumns);
      return <>
      {columns[1].filterDropdown ? (columns[1] as any).filterDropdown(args) : null}
      </>
    }

    const { getByTestId } = render(<TestComponent/>);
    const closeButton = getByTestId('close-btn-name');
    fireEvent.click(closeButton);
    expect(args.close).toBeCalled();
  });

  it('on close button clicked should execute close()', async () => {
    const sampleColumns = [
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
        onPageSearchEnabled: true
      }
    ];
    
    const TestComponent = () => {
      const { columns } = useOnPageSearchColumn(sampleColumns);
      return <>
      {columns[1].filterIcon ? (columns[1] as any).filterIcon(true) : null}
      </>
    }

    const { getByTestId } = render(<TestComponent/>);
    const filterIcon = getByTestId('filter-icon-name');
    expect(filterIcon).toBeInTheDocument();
  });
})

