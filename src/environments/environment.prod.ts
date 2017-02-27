const baseURI: string = 'caplatform.herokuapp.com';

export const ENV = {
  production: true,
  apiWs: `ws://${baseURI}/cable`,
  apiUrl: `http://${baseURI}/api`
};
