export const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;

export const loginRequest = {
    scopes: ['user.read']
};

export const protectedResources = {
    graphMe: {
        endpoint: "https://graph.microsoft.com/v1.0/me",
        scopes: ["user.read"]
    }
};
export const clientId="79f0aacd-52b2-441e-bfb4-533baf355192"; 
export const authority="https://login.microsoftonline.com/179de649-b1b3-41b6-8c84-b52ff0edbc84/"; 
export const redirectUri="http://localhost:4200";
export const tenantId="179de649-b1b3-41b6-8c84-b52ff0edbc84"