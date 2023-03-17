import React from "react";
import { StackViewContext } from '../contexts/stack-view-context';

export function useStackView() {
  const context = React.useContext(StackViewContext);
  if (context === undefined) {
    throw new Error('useStackView must be used within a StackViewProvider');
  }
  return context;
}