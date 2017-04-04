const baseURI = 'caplatform.herokuapp.com';

export const ENV = {
  production: true,
  apiWs: `ws://${baseURI}/cable`,
  apiUrl: `https://${baseURI}/api`
};
