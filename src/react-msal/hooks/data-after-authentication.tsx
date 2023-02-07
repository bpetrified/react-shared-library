import React from 'react';
import { WaitForAuthenticationContext } from '../contexts/wait-for-authentication-context';

export function useDataAfterAuthentication<T>() {
  const context = React.useContext<T>(WaitForAuthenticationContext as any);
  if (context === undefined) {
    throw new Error('useDataAfterAuthentication must be used within a WaitForAuthenticationProvider');
  }
  return context;
}