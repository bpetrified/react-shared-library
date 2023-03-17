import React, { useRef } from 'react';
import { StackViewHelper } from '../helpers/stack-view-helper';

export const StackViewContext = React.createContext<StackViewContextValue>({
  push: () => { },
  pop: () => { },
  popToIndex: () => { },
  getInstance: () => ({})
});

type StackViewContextValue = {
  push: (params: StackViewPushParams) => void;
  pop: () => void;
  popToIndex: (index: number) => void;
  getInstance: () => StackViewHelper ,
};

export type StackViewPushParams = {
  view: React.ReactElement;
  data?: any;
}

export function StackViewProvider({ children, injectedValue }: {
  children: React.ReactNode,
  injectedValue?: StackViewContextValue & { id: string }
}) {
  // Init StackHelper for this provider...
  const instance = useRef<StackViewHelper>(new StackViewHelper());

  const value: StackViewContextValue = {
    push: (params: StackViewPushParams) => {
      instance.current.push?.(params);
    },
    pop: () => {
      instance.current.pop?.();
    },
    popToIndex: (index: number) => {
      instance.current.popToIndex?.(index);
    },
    getInstance: () => instance.current
  };

  return (
    <StackViewContext.Provider value={injectedValue ? injectedValue : value}>
      {children}
    </StackViewContext.Provider>
  );
}
