import React from 'react';
import { render } from '@testing-library/react';
import { DataTable  } from '../components/data-table';
import { DataTableColumn } from '../hooks/custom-column-hook';
describe('DataTable Test', () => {

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should render with the correct text', () => {
    const sampleColumns = [
      {
        title: "id",
        dataIndex: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Gender",
        dataIndex: "gender",
        sorter: {},
      },
      {
        title: "Age",
        dataIndex: "age",
        sorter: {},
      },
      {
        title: "Address",
        dataIndex: "address",
      }
    ] as DataTableColumn<any>[];

    const sampleData = [
      {
        id: "1",
        name: "Boran",
        gender: "male",
        age: "12",
        address: "New York"
      },
      {
        id: "2",
        name: "JayChou",
        gender: "male",
        age: "38",
        address: "TaiWan"
      },
      {
        id: "3",
        name: "Lee",
        gender: "female",
        age: "22",
        address: "BeiJing"
      },
      {
        id: "4",
        name: "ChouTan",
        gender: "male",
        age: "31",
        address: "HangZhou"
      },
      {
        id: "5",
        name: "AiTing",
        gender: "female",
        age: "22",
        address: "Xi’An"
      }
    ];
    const { getByText } = render(<DataTable dataSource={sampleData} columns={sampleColumns}/>);
    const rendered = getByText('Boran');
    expect(rendered).toBeTruthy();
  });
})

