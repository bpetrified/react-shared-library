A React MSAL library built on top of the one provided by Microsoft.

Please ensure you have basic understanding of the original library here - https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react before start using this one.

# Features
  - Easier initialisation steps
  - Useful components/hooks


# Initialise
1. Initialise with MSAL config and login scopes
```js
// MSAL imports
import { ReactMsal } from '@bpetrified/react-msal';

const msalConfig = {
    auth: {
        clientId: "3358519d-3f20-4132-ba80-aae332dfc0bf",
        authority: "https://login.microsoftonline.com/8b41a058-9ec4-4f21-8450-44bf843a0b44/",
        redirectUri: "/",
        postLogoutRedirectUri: "/"
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest = {
    scopes: ["User.Read", 'group.Read.All']
};

const msalInstance = ReactMsal.initialise({ msalConfig, loginRequest });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App pca={msalInstance}/>
  </React.StrictMode>
);

```
2. Wrap your main component with "MsalProvider"
```js
  <MsalProvider instance={{your passed MSAL Instance}}>
    /** your react components **/
    .....
    ....
    ...
  </MsalProvider>
```

# Usage
### "useUserInGroups" hook
Use this hook to check if user is authorised (include in AD usergroups)
```js
import { useUserInGroups } from '@bpetrified/react-msal';

const MyComponent = () => {
  const { isAuthorised } = useUserInGroups(['239fa1e2-ce18-4503-9193-c9d2ed4f2871'], 
    /**
    * Check if user is in any of the target group, 
    * use "UserGroupVerificationMode.ALL" to require user to be a member of all target groups
    **/
    verificationMode: UserGroupVerificationMode.ANY);
  return <>
  {isAuthorised == null ? <div>Checking....</div> 
    : isAuthorised == false ? <div>You are not authorised...</div>
      : <div>You are authorised!!</div>}
  </>;
};
```

### "WaitForAuthentication" component
Use this component to ensure authentication is done before rendering your main route router. This could prevent screen flashing from 'unauthorised' to 'authorised' state. The other initiations of the app can also be processed by passing a promise return function to "loaderAfterAuthentication" prop. 
```js
export const routesConfig = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "count",
        element: <Count />,
      },
      {
        path: "count2",
        element: <Count2 />,
      },
      {
        path: "no-access",
        element: <NoAccess />,
      },
    ],
  }
] as RouteObject[];

const router = createBrowserRouter(routesConfig);

function App({ pca }: { pca: PublicClientApplication }) {
  return (
    <CombinedProviders pca={pca}>
      <WaitForAuthentication loadingComponent={<>loading!</>} 
      loaderAfterAuthentication={async () => {
        // Get some data to initialise your app
        return fetch('https://getconfig.com');
      }}
      errorComponent={<>error!</>}
      >
        <RouterProvider router={router} />
      </WaitForAuthentication>
    </CombinedProviders>
  );
}
export default App;
```
  #### Props
  ##### loadingComponent (optional)   
  React element to show when the authentication is inprogress or "loaderAfterAuthentication" is loading if "loaderAfterAuthentication" is provided. 
  ##### loaderAfterAuthentication (optional)
  A loader function that is executed when the authentication result is ready, use this to initialise your application (e.g., get I18n resoures, configurations from BE)
  ##### errorComponent
  React element to show when the "loaderAfterAuthentication" error.
  
### "useDataAfterAuthentication" hook
Any descendant component of "WaitForAuthentication" can use this hook to access data from "loaderAfterAuthentication" prop. 

```js
import { useUserInGroups } from '@bpetrified/react-msal';

const MyComponent = () => {
  const { data } = useDataAfterAuthentication();
  
  return <>
   <div>{data}</div>
  </>;
};
```

### Original React MSAL 
You can import any components/hooks provided by original "@azure/msal-browser" or "@azure/msal-react". Please check https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react
```js
import { useMsal } from '@bpetrified/react-msal';
```

