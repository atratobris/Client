const baseURI = 'caplatform.herokuapp.com';

export const ENV = {
  production: true,
  apiWs: `wss://${baseURI}/cable`,
  apiUrl: `https://${baseURI}/api`
};
