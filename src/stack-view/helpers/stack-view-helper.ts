import { StackViewPushParams } from "../contexts/stack-view-context";

export class StackViewHelper {
  push?: (params: StackViewPushParams) => void;
  pop?: () => void;
  popToIndex?: (index: number) => void;
}