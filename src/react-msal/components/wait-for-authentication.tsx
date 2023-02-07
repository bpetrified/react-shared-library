import React, { useEffect, useState } from "react";
import { WaitForAuthenticationProvider } from "../contexts/wait-for-authentication-context";
import { WaitForAuthenticationHelper } from "../helpers/wait-for-authentication-helper";
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';

type WaitForAuthenticationType = {
  children: React.ReactElement;
  loadingComponent?: React.ReactElement;
  loaderAfterAuthentication?: (isAuthorised: boolean) => Promise<any>;
  errorComponent?: React.ReactElement;
}

export const WaitForAuthentication = ({ loadingComponent, children, loaderAfterAuthentication, errorComponent }: WaitForAuthenticationType) => {
  const { inProgress } = useMsal();
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(false);
  const [loaderData, setLoaderData] = useState(false);

  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      executeLoader();
    }
  }, [inProgress]);

  const executeLoader = async () => {
    try {
      const data = await loaderAfterAuthentication?.(isAuthenticated);
      setLoaderData(data);
    } catch (e) {
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