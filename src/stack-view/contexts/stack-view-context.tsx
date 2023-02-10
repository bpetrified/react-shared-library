import React from 'react';
import { StackItem, StackViewHelper } from '../helpers/stack-view-helper';

export const StackViewContext = React.createContext<StackViewContextValue | undefined>(undefined);

type StackViewContextValue = { 
  push: (params: StackViewPushParams) => void;
  pop: () => void;
  popToIndex: (index: number) => void;
  getStack: () => StackItem[];  
};

export type StackViewPushParams = { 
  view: React.ReactElement; 
  data?: any;
}

export function StackViewProvider({ children, injectedValue }: {
  children: React.ReactElement,
  injectedValue?: StackViewContextValue
}) {
  const value: StackViewContextValue = {
    push: (params: StackViewPushParams) => {
      StackViewHelper.push(params);
    },
    pop: () => {
      StackViewHelper.pop();
    },
    popToIndex: (index: number) => {
      StackViewHelper.popToIndex(index);
    },  
    getStack: () => StackViewHelper.stack
  };

  return (
    <StackViewContext.Provider value={injectedValue ? injectedValue : value}>
      {children}
    </StackViewContext.Provider>
  );
}

