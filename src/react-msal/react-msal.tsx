import { PublicClientApplication, EventType, Configuration } from "@azure/msal-browser";
import { UserGroupsHelper } from "./helpers/user-groups-helper";
import { WaitForAuthenticationHelper } from "./helpers/wait-for-authentication-helper";

export type MsalLoginRequest = {
  scopes: string[]
}

type InitialiseParameter = {
  msalConfig: Configuration,
  loginRequest: MsalLoginRequest,
  getGroupsGraphUrl?: string
}

export class ReactMsal {
  static loginRequest: MsalLoginRequest;
  static initialise(args: InitialiseParameter) {
    ReactMsal.loginRequest = args.loginRequest;
    const msalInstance = new PublicClientApplication(args.msalConfig);

    // Default to using the first account if no account is active on page load
    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
      // Account selection logic is app dependent. Adjust as needed for different use cases.
      msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    // Optional - This will update account state if a user signs in from another tab or window
    msalInstance.enableAccountStorageEvents();

    msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && (event.payload as any).account) {
        WaitForAuthenticationHelper.setRedirectedToLogin(true);
        const account = (event.payload as any).account;
        msalInstance.setActiveAccount(account);
      }
    });

    // Set graph url from parameter...
    UserGroupsHelper.getGroupsGraphURL = args.getGroupsGraphUrl || UserGroupsHelper.getGroupsGraphURL;

    return msalInstance;
  }
}
