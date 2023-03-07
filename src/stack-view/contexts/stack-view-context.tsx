import React, { useRef } from 'react';
import { StackViewHelper } from '../helpers/stack-view-helper';

export const StackViewContext = React.createContext<StackViewContextValue & { id: string }>({
  push: () => { },
  pop: () => { },
  popToIndex: () => { },
  id: ''
});

type StackViewContextValue = {
  push: (params: StackViewPushParams) => void;
  pop: () => void;
  popToIndex: (index: number) => void;
};

export type StackViewPushParams = {
  view: React.ReactElement;
  data?: any;
}

export function StackViewProvider({ children, injectedValue }: {
  children: React.ReactNode,
  injectedValue?: StackViewContextValue & { id: string }
}) {
  const idRef = useRef<string>(makeId(5));
  // Init Stack for this provider...
  StackViewHelper.stacks[idRef.current] = { push: () => ({}), pop: () => ({}), popToIndex: () => ({})};

  const value: StackViewContextValue = {
    push: (params: StackViewPushParams) => {
      StackViewHelper.stacks[idRef.current].push?.(params);
    },
    pop: () => {
      StackViewHelper.stacks[idRef.current].pop?.();
    },
    popToIndex: (index: number) => {
      StackViewHelper.stacks[idRef.current].popToIndex?.(index);
    }
  };

  return (
    <StackViewContext.Provider value={injectedValue ? injectedValue : {...value, id: idRef.current}}>
      {children}
    </StackViewContext.Provider>
  );
}

function makeId(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
