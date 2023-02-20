import { Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { StackViewPushParams } from '../contexts/stack-view-context';
import { StackViewHelper } from '../helpers/stack-view-helper';
import styles from '../scss/stack-view.module.scss'; // Import css modules stylesheet as styles

type StackViewProps = {
  children: React.ReactNode;
  animated?: boolean;
}

export const StackView: React.FC<StackViewProps> = (props) => {
  const [activeKey, setActiveKey] = useState('initial');
  const [items, setItems] = useState([
    { label: `Tab ${1}`, children: props.children, key: 'initial', data: undefined }
  ]);
  const newTabIndex = useRef(0);

  useEffect(() => {
    if(!!!StackViewHelper.stack?.length) {
      StackViewHelper.stack = items;
    }

    const remove = (targetKey: string) => {
      const targetIndex = items.findIndex((pane) => pane.key === targetKey);
      const newPanes = items.filter((pane) => pane.key !== targetKey);
      if (newPanes.length && targetKey === activeKey) {
        const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
        setActiveKey(key);
      }
      setItems(newPanes);
      StackViewHelper.stack = newPanes;
    };

    const removeUntilIndex = (index: number) => {
      if(items.length <= index) {
        throw Error(`index ${index} is out of the stack bound`);
      }
      const newItems = [...items];
      StackViewHelper.stack = newItems.splice(index + 1);
      setItems(newItems);
      setActiveKey(newItems[newItems.length-1].key);
    }

    const add = (params: StackViewPushParams) => {
      const newActiveKey = `${newTabIndex.current++}`;
      const newTabs = [...items, { label: 'New Tab', children: params.view, key: newActiveKey, data: params.data }]
      StackViewHelper.stack = newTabs;
      setItems(newTabs);
      setActiveKey(newActiveKey);
    };

    StackViewHelper.push = add;
    StackViewHelper.pop = () => {
      remove(activeKey);
    };
    StackViewHelper.popToIndex = removeUntilIndex;
  }, [activeKey, items]);

  return (
    <div>
      <Tabs
        className={styles.stackView}
        animated={props.animated}
        hideAdd
        activeKey={activeKey}
        type="editable-card"
        items={items}
      />
    </div>
  );
};