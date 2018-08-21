// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
    // ApiURL: 'http://localhost:3000/api/',
    // ApiHostURL: 'http://localhost:3000/',
    ApiURL: 'https://icoupvoteapi.herokuapp.com/api/',
    ApiHostURL: 'https://icoupvoteapi.herokuapp.com/',
    AppHostURL: 'https://localhost:4200',
    GoogleProviderID: '853849272854-i2bpckdiorbb2ek72qjia5mbmg0t2s0t.apps.googleusercontent.com',
    FacebookProviderID: '169972637210542',
    LinkediInProviderID: '819n7v4l31xidr'
};
