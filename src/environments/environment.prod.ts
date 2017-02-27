const baseURI: string = 'caplatform.herokuapp.com';

export const environment = {
  production: false,
  apiWs: `ws://${baseURI}/cable`,
  apiUrl: `http://${baseURI}/api`
};
