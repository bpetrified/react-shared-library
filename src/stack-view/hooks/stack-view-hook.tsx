import React from "react";
import { StackViewContext } from '../contexts/stack-view-context';

export function useStackView() {
  const context = React.useContext(StackViewContext);
  if (context === undefined) {
    throw new Error('useStackView must be used within a StackViewProvider');
  }
  const currentStack = context.getStack?.();
  const stackData = currentStack ? currentStack[currentStack.length-1].data : undefined;
  return { ...context, stackData };
}
