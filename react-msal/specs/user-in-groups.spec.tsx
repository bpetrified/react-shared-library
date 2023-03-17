import { isIncludeInGroup, UserGroupVerificationMode } from '../hooks/user-in-groups';

describe('User Authorised Hook Test', () => {
  beforeEach(() => {
  
  });

  it('isIncludeInGroup func', () => {
    expect(isIncludeInGroup(['a', 'b'], ['a'], UserGroupVerificationMode.ANY)).toBeTruthy();
    expect(isIncludeInGroup(['a', 'b'], ['a'], UserGroupVerificationMode.ALL)).toBeFalsy();
    expect(isIncludeInGroup(['a', 'b'], [], UserGroupVerificationMode.ALL)).toBeFalsy();
    expect(isIncludeInGroup(['a', 'b'], ['c'], UserGroupVerificationMode.ALL)).toBeFalsy();
    expect(isIncludeInGroup(['a', 'b'], ['c'], UserGroupVerificationMode.ANY)).toBeFalsy();
    expect(isIncludeInGroup(['a', 'b'], ['a', 'b', 'c'], UserGroupVerificationMode.ALL)).toBeTruthy();
    expect(isIncludeInGroup(['b', 'a'], ['a', 'b', 'c'], UserGroupVerificationMode.ALL)).toBeTruthy();
    expect(isIncludeInGroup(['a', 'b'], ['c'], UserGroupVerificationMode.ANY)).toBeFalsy();
  });
})

