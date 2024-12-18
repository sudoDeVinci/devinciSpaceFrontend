# Devinci.Cloud

This is my personal portfolio website, devinci.cloud. The site is modeled after a Windows 98 desktop, complete with a start menu, taskbar, and desktop icons. The site components are built purely as ES6 modules, and bundled using Vite.

Styling for the windows components is done using the [98.css](https://jdan.github.io/98.css/) package for consistency. 

## Usage

I have defined a number of npm script keywords in the `package.json` file to make it easier to run the site locally. Eg. `npm run build` will build the site using Vite via `vite build`, and `npm run serve` will start a local server to serve the site via `vite preview`.

```json
"scripts": {
        "http-server": "npx http-server -p 9001",
        "dev": "vite",
        "build": "vite build",
        "serve": "vite preview",
        ...
        "clean-all": "npm run clean && rm -rf node_modules/ && rm -f package-lock.json"
    },
```

If you'd like to run this site locally, you can do so by cloning the repository and running the following:

1. Install dependencies
    ```bash
    npm install
    ```

2. Build the site using Vite
    ```bash
    npm run build
    ```

3. Start the server
    ```bash
    npm run serve
    ```

## Current Visual

![Current Visual](/public/images/screenshot.png)