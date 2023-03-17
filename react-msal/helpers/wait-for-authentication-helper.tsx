export class WaitForAuthenticationHelper {
  private static resolver: any;
  private static _redirectedToLogin: boolean;
  private static resolved = false;
  private static waitForAuthenticationCheckCompletedPromise = new Promise((resolve) => {
    WaitForAuthenticationHelper.resolver = resolve;
  });
  static waitForAuthenticationCheckCompleted = () => {
    return WaitForAuthenticationHelper.waitForAuthenticationCheckCompletedPromise;
  };
  static authenticationCheckComplete = () => {
    WaitForAuthenticationHelper.resolved = true;
    WaitForAuthenticationHelper.resolver();
  };
  static isRedirectedToLogin(): boolean {
    if(!WaitForAuthenticationHelper.resolved) {
      throw ('Calling "isFromLogin" before authentication check is completed is forbidden, please ensure "waitForAuthenticationCheckCompleted" is called before this.');
    } else {
      return WaitForAuthenticationHelper._redirectedToLogin || false;
    }
  }
  static setRedirectedToLogin(value: boolean) {
    WaitForAuthenticationHelper._redirectedToLogin = value;
  }
}