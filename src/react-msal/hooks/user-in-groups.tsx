import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { UserGroupsHelper } from '../helpers/user-groups-helper';
import { ReactMsal } from '../react-msal';

export enum UserGroupVerificationMode {
  ANY = 'ANY',
  ALL = 'ALL'
}

export function useUserInGroups(targetGroups: string[], verificationMode?: UserGroupVerificationMode) {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();
  const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);
  const getToken = async () => {
    if (!account) {
      return;
    }
    const response = await instance.acquireTokenSilent({
      ...ReactMsal.loginRequest,
      account,
    });

    if (
      !response ||
      !response.idTokenClaims ||
      !(response.idTokenClaims as any).groups
    ) {
      setIsAuthorised(false);
    } else { // Cache available
      const cached = UserGroupsHelper.groups;
      // As group claims maximum is 200, too prevent unexpected behavior, we will fetch user's group from api instead when user have lots of groups...
      const shouldFetchGroups = (response.idTokenClaims as any).groups.length > 199;
      const userGroups = shouldFetchGroups ? (cached ? cached : await fetchGroups(response.accessToken)) : (response.idTokenClaims as any).groups;
      setIsAuthorised(
        userGroups ? isIncludeInGroup(targetGroups, userGroups, verificationMode || UserGroupVerificationMode.ANY) : null
      );
    }
  };

  const fetchGroups = async (token: string) => {
    const response = await fetch(UserGroupsHelper.getGroupsGraphURL, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({securityEnabledOnly: true}) // body data type must match "Content-Type" header
    });
    const parsedResp = await response.json();
    UserGroupsHelper.groups = parsedResp.value;
    return parsedResp.value;
  };

  useEffect(() => {
    getToken();
  }, [instance]);

  return { isAuthorised };
}

export const isIncludeInGroup = (targetGroups: string[], userGroups: string[], verificationMode: UserGroupVerificationMode) => {
  let count = 0;
  for(let i = 0; i<targetGroups.length; i++) {
    const isInclude = userGroups.includes(targetGroups[i]);
    if (verificationMode === UserGroupVerificationMode.ANY && isInclude) {
      return true;
    } else if (verificationMode === UserGroupVerificationMode.ALL) {
      count += isInclude ? 1 : 0;
    }
  }
  return count === targetGroups.length;
};



