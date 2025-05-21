# HIFI✨

**This project is seriously outdated**. I've passed the hardware on, and keeping this repo available for the new owner.

## Structure

### hifisparks-iron

This is the hardware layer of the project, it currently needs an arduino board plugged in to run.

### hifisparks-glitter

The front end of hifisparks. It's mobile-first, targeted at newer browers.

### hifisparks-lib

The shared component and utility library of hifisparks, and the place to go for doing component development without having to run this whole shebang. It has [Storybook](https://storybook.js.org/) configured.

## Dev guide

**Recommended node version is `10.5.0`** - this is what the project was built with. `10.24.1` or `12.22.12` should also work, newer versions will most likely cause issues.

This is a project built using [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

[Parcel](https://parceljs.org/) is used for bundling and transpiling, except when it isn't, specifically in Storybook. That is a bummer and will probably lead to incosistencies.

Using [Visual Studio Code](https://code.visualstudio.com/) is highly recommended, as the project will have many specific configurations, and was built to Just Work in that environment.

### Getting it running

If running in a docker container, make sure you give `hifisparks-iron` access to the arduino serial port.

Assuming you're running a debian-based linux distro:

First, install some system-level packages `node-gyp` will need to build the serial bindings:
```
sudo apt update && sudo apt upgrade
sudo apt install build-essentials python3-setuptools`
```

I recommend installing node using `nvm`, if not familiar, just use [their install script](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script).

Install the required node version:
```
nvm install lts/dubnium && nvm use lts/dubnium
```

**Don't foget to switch to this version when running the project.**

Install yarn:

```
npm install -g yarn
```

Install dependencies:
```
yarn install
```

Connect the arduino board (running `jonny-five`), and start the back end:
```
yarn workspace iron run dev
```

From a separate terminal, run the front end:

```
yarn workspace glitter run dev
```

### TypeScript

Absolutely no JS. No ifs, no buts. Prefer types to interfaces, keep it functional.

TSLint is there instead of a written style guide, and it should watch your every move. Make sure you have it working!

### React

Use [styled-components](https://www.styled-components.com/), use [hooks](https://reactjs.org/docs/hooks-intro.html).
