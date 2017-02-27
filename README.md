# Client

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.26.
Please refer to [ng2-dragula](https://github.com/valor-software/ng2-dragula) for drag and drop library documentations

## Prerequisites
```bash
npm install -g angular-cli
```

## Updating angular
[SOURCE](https://github.com/angular/angular-cli#updating-angular-cli)

If you're using Angular CLI `beta.28` or less, you need to uninstall `angular-cli` package. It should be done due to changing of package's name and scope from `angular-cli` to `@angular/cli`:
```bash
npm uninstall -g angular-cli
npm uninstall --save-dev angular-cli
```

To update Angular CLI to a new version, you must update both the global package and your project's local package.

Global package:
```bash
npm uninstall -g @angular/cli
npm cache clean
npm install -g @angular/cli@latest
```

Local project package:
```bash
rm -rf node_modules dist # use rmdir on Windows
npm install --save-dev @angular/cli@latest
npm install
```

You can find more details about changes between versions in [CHANGELOG.md](https://github.com/angular/angular-cli/blob/master/CHANGELOG.md).

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to GitHub Pages

Run `ng github-pages:deploy` to deploy to GitHub Pages.

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
