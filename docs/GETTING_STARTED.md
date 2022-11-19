# Getting Started

To get start the project you may need to know the things we use for this project.

## Framework

Angular is the framework we use, and we are trying to relay on it as much as possible especially packages including component development kit.

## Coding Formatter

We use [Prettier](https://prettier.io/) for the code formatter, set your IDE to apply prettier rules to the codebase.

## General Concept

### [Tailwind CSS](https://tailwindcss.com/)

We are using Tailwind CSS for styling the pages and component with fully customized configuration. Configuration can be found [here - tailwind.config.js](../tailwind.config.js).

Current customizations:

- Colors: (danger, warn, accent, primary, secondary... along with default colors)
- Font weights: `normal: 400, medium: 600, bold: 700, black: 900`
- Font size: `5 ~ 80`
- Spacing: `5, 10, 15, 20... 800`. example, `mx-15, py-30`
- Min/Max size: `5, 10, 15, 20... 800`. example, `max-w-100, min-h-300`

And default tailwind css classes can be used.

### [Angular Material](https://material.angular.io/)

Angular Material with [Angular CDK](https://material.angular.io/cdk/categories) is the main design concept of the project. We use material components such as **Buttons**, **Dialogs**, **Tables** and so on.

### [Angular Material Extensions](https://github.com/ng-matero/extensions)

Additional components such as Slider and Auto complete can be used from this library.

### [Plotly](https://plotly.com/)

All charts are drawn with this library. We are using [Angular version of the Plotly.js](https://github.com/plotly/angular-plotly.js/blob/master/README.md) for our project. Please refer plotly document for further options.

### Others

There are some more other libraries we are using in the project such as `date-fns`, `lodash` and so on.
