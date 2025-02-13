# Devinci.Cloud

![Current Visual](/public/images/screenshot.png)

This is the frontend component of personal portfolio website, devinci.cloud. The site is modeled after a Windows 98 desktop, complete with a start menu, taskbar, and desktop icons. The site components are built purely as ES6 modules, and bundled using Vite.

Styling for the windows components is done using the [98.css](https://jdan.github.io/98.css/) package for consistency.

The Server component of the site is a custom minimal Flask server and sqlite database, available [here](https://github.com/sudoDeVinci/devincicloud-backend). 

# Usage

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

# The Window Manager

`Windows` and other visual objects in our app like `Icons` sit inside and are managed by the `Environment` class.
The Enviornment as an object in the DOM is just a div which spans the entirety of the viewport and doesn't scroll. The Environment as a Javascript class manages and manipulates the objects viewable to the user.

The Environment is of course made of the different parts which makes up a desktop, viewable below.

![environment](/public/images/environment.png)

In each label, from top to bottom you're given
1. The name of the piece
2. The CSS class/ID name
3. The attribute name within the Envionment class

When creating a new 

# Windows

Windows can be created with the `newWindow` method of the Environment. When creating a Winidow, we pass the window class type as well as a WindowConfig object to style and set the state of our window. This is as simple as:

```js
const env = new Environment(true)


const config = {
    height: 300,
    width: 400,
    icon: '🔥',
    title: 'Environment Test',
    content: '<p>This is a test</p>'
}

env.newWindow(Window, config)
```

This for example, creates the following:

![Simple Window](/public/images/simpleWindow.png)

we can also set window positions, and their z-index.

```js
const env = Environment(true)

const config = {
    height: 150,
    width: 1000,
    x: 2000,
    y: 500,
    title: "Other testing window",
    content: "<p> Nothing to see here people </p>" 
}

env.newWindow(Window, config)
```

# The Window Class

The Window class isn