# Data Dash Admin Panel

Data Dash is the Admin panel that allows users to manage relevant, targeted and local indexes in a single platform with advanced analytics graphs and functionalities.

## Documentation

Here you can find the fundamentals and explore advanced topics of the project.

* [Getting Started](./docs/GETTING_STARTED.md)
* [Architecture](./docs/ARCHITECTURE.md)
* [Coding Style](./docs/CODING_STYLE.md)
* [Coding Practice](./docs/CODING_PRACTICE.md)
* [Naming Conventions](./docs/NAMING.md)
* [Git Conventions](./docs/GIT_CONVENTION.md)
* [Pull Requests](./docs/PULL_REQUEST.md)

## Development Setup

### Prerequisites

* Install [Node.js](https://nodejs.org/en/) which includes [Node Package Manager](https://docs.npmjs.com/getting-started). Recommended Node version is ^14.0.0
* Better to install [Angular CLI](https://angular.io/cli) on your local to use commands and run server directly using `ng` commands.

### Start the Development

#### Branch rules

We use `master` branch for the staging server and `prod` branch for the production server. Git push to the `master` branch or `prod` branch will be automatically pushed to the live servers.

To start the development, check out the `develop` branch and do all works on it, and should be merged into `master` after the team review.

#### Commands

```bash
# Install npm packages
$ npm install

# Run development server
$ npm start

# Build for the staging. The build artifacts will be stored in the `dist/` directory.
$ npm run build:staging

# Build for the production
$ npm run build
```

### Code scaffolding

Simply you can use Angular CLI for generating all entities of the Angular. You can use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
