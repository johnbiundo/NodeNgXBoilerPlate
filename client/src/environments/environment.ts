// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  protocol: 'https://',
  get root() {
    return `${this.protocol}localhost:5000`;
  },
  get api() {
    return `${this.root}/api/v1`;
  },
  title: 'SampleApp',
  get appUri() {
    return `${this.protocol}localhost:4200`;
  },
  get oauthUri() {
    return `${this.appUri}/oauth`;
  },
  ghClientId: '',
  liClientId: '',
  fbClientId: '',
  gClientId: '',
  pageSize: 25,

};
