import React from 'react';

type WaitForAuthenticationProviderProps<T> = {
  data?: T,
  children: React.ReactElement
};

export const WaitForAuthenticationContext = React.createContext({});

export function WaitForAuthenticationProvider<T>({ children, data }: WaitForAuthenticationProviderProps<T>) {
  return (
    <WaitForAuthenticationContext.Provider value={data || {}}>
      {children}
    </WaitForAuthenticationContext.Provider>
  );
}