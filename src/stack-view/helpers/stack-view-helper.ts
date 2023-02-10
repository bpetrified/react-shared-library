import { StackViewPushParams } from "../contexts/stack-view-context";

export type StackItem = {
  data?: any;
  key: string; // Reference to a tab in antd tab...
}

export class StackViewHelper {
  static push: (params: StackViewPushParams) => void;
  static pop: () => void;
  static popToIndex: (index: number) => void;
  static stack: StackItem[];
}