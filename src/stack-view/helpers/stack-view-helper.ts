import { StackViewPushParams } from "../contexts/stack-view-context";

export class StackViewHelper {
  static stacks: {
    [key: string]: {
      push?: (params: StackViewPushParams) => void,
      pop?: () => void;
      popToIndex?: (index: number) => void;
    }
  } = {};
}