// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  protocol: 'https://',
  get root() {
    return `${this.protocol}mysampleappstage.herokuapp.com`;
  },
  get api() {
    return `${this.root}/api/v1`;
  },
  title: 'mysampleapp',
  get appUri() {
    return `${this.protocol}v2mysampleappstage.herokuapp.com`;
  },
  get oauthUri() {
    return `${this.appUri}/oauth`;
  },
  ghClientId: '',
  liClientId: '',
  fbClientId: '',
  gClientId: '',
  pageSize: 25
};
