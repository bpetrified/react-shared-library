A component that uses Ant Design "Table" with features: 
  - Drag and drop columns
  - Handling fetch data from BE

```
import { DataTable } from '@bpetrified/data-table';
```

### Simple data table that can drag and drop column

```js live
<DataTable dataSource={[
  {
    key: "1",
    name: "Boran",
    gender: "male"
  },
  {
    key: "2",
    name: "JayChou",
    gender: "male"
  },
  {
    key: "3",
    name: "Lee",
    gender: "female"
  },
], columns: [
  {
    title: "Key",
    dataIndex: "key"
  },
  {
    title: "Name",
    dataIndex: "name"
  },
  {
    title: "Gender",
    dataIndex: "gender"
  }
] }/>
```

### Table Ref
The Table "ref" can be read to obtain current sorters, paginations, loading state of the table, including fetch function to refresh the data from BE. 

```js 
  <>
    <Button type="primary" onClick={() => {
      tableRef.current?.fetchData();
    }}>Refresh</Button>
    <DataTable
      ref={tableRef}
      columns={columns}
      rowKey={(record) => record.id}
      pagination={{ showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`}}
      fetchFunction={fetchProduct}
    />
  </>
  ```

### Pagination Configuration
Pagination can be configured like original "Antd Table" by passing props https://ant.design/components/pagination/#api. 

  ```js 
  <DataTable
      dataSource={[
          {
            key: "1",
            name: "Boran",
            gender: "male"
          }
        ], columns: [
          {
            title: "Key",
            dataIndex: "key"
          },
          {
            title: "Name",
            dataIndex: "name"
          },
          {
            title: "Gender",
            dataIndex: "gender"
          }
        ]}
      pagination={{ showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`}}
    />
  ```


  
  