import { AccountInfo, InteractionStatus, IPublicClientApplication } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import React, { useEffect, useState } from "react";
import { WaitForAuthenticationProvider } from "../contexts/wait-for-authentication-context";
import { WaitForAuthenticationHelper } from "../helpers/wait-for-authentication-helper";
import { ReactMsal } from '../react-msal';

type WaitForAuthenticationPropType = {
  children: React.ReactElement;
  loadingComponent?: React.ReactElement;
  loaderAfterAuthentication?: (isAuthorised: boolean) => Promise<any>;
  errorComponent?: React.ReactElement;
  onInteractionRequiredAuthError?: (e: any, _msalInstance: IPublicClientApplication) => {}
}

export const WaitForAuthentication = ({ loadingComponent, children, loaderAfterAuthentication, errorComponent, onInteractionRequiredAuthError }: WaitForAuthenticationPropType) => {
  const { inProgress, instance } = useMsal();
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(false);
  const [loaderData, setLoaderData] = useState(false);

  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      executeLoader(isAuthenticated, instance);
    }
  }, [inProgress, isAuthenticated, instance]);

  const executeLoader = async (_isAuthenticated: boolean, _msalInstance: IPublicClientApplication) => {
    try {
      /*
      * There is a case that isAuthenticated = true, but the token is not valid,
      * So we try acquiring token to ensure token validity
      */
      if (_isAuthenticated) {
        const account = _msalInstance.getActiveAccount();
        await _msalInstance.acquireTokenSilent({
          ...ReactMsal.loginRequest,
          account: account as AccountInfo
        })
      }
      const data = await loaderAfterAuthentication?.(_isAuthenticated);
      setLoaderData(data);
    } catch (e) {
      if ((e as any).name == 'InteractionRequiredAuthError') {
        // Allow custom handling of "InteractionRequiredAuthError"
        (!!onInteractionRequiredAuthError ? () => {
          onInteractionRequiredAuthError(e, _msalInstance);
        } : () => {
          _msalInstance.loginRedirect(ReactMsal.loginRequest);
        })();
      }
      setError(true);
      return;
    }
    WaitForAuthenticationHelper.authenticationCheckComplete();
    setCompleted(true);
  };
  return <>
    {completed ? <WaitForAuthenticationProvider data={loaderData}>
      {children}
    </WaitForAuthenticationProvider>
      : error ? (errorComponent || null) : (loadingComponent || null)}
  </>;
};

function eraseCookie() {
  var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }
}