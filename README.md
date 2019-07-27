# HIFI✨

## Structure

### hifisparks-iron

This is the hardware layer of the project, it currently needs an arduino board plugged in to run.

### hifisparks-glitter

The front end of hifisparks. It's mobile-first, targeted at newer browers.

### hifisparks-lib

The shared component and utility library of hifisparks, and the place to go for doing component development without having to run this whole shebang. It has [Storybook](https://storybook.js.org/) configured.

## Dev guide

**Recommended node version is `10.5.0`**

This is a project built using [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/), to initialize everything just run `yarn` form the project root.

There should be no global dependencies! Except for a working [node.js](https://nodejs.org) setup and globally installed [yarn](https://yarnpkg.com).

Using [nvm](https://github.com/nvm-sh/nvm) or an equivalent is recommended.

**To run any of the sub-projects, just switch to their directories and run `yarn dev`**. Make sure to keep this consistent in the future with build commands and so on.

[Parcel](https://parceljs.org/) is used for bundling and transpiling, except when it isn't, specifically in Storybook. That is a bummer and will probably lead to incosistencies.

Using [Visual Studio Code](https://code.visualstudio.com/) is highly recommended, as the project will have many specific configurations, and was built to Just Work in that environment.

### TypeScript

Absolutely no JS. No ifs, no buts. Prefer types to interfaces, keep it functional.

TSLint is there instead of a written style guide, and it should watch your every move. Make sure you have it working!

### React

Use [styled-components](https://www.styled-components.com/), use [hooks](https://reactjs.org/docs/hooks-intro.html) (srsly, no classes).
