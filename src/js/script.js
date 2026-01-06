import Environment from "./environment.js";
import { Window } from "./Windows/window.js";
import Popup from "./Windows/timedwindow.js";
import { Icon } from "./Icon.js";
import MusicPlayer from "./Windows/musicplayer.js";
import SecretWindow from "./Windows/secretwindow.js";

/** @import {WindowConfig} from './Windows/window.js' */
/** @import {IconConfig} from './Icon.js' */
/** @import {TaskbarConfig} from './Taskbar.js'*/
/** @import {TaskbarButtonConfig} from './environment.js*/
/** @import {EnvironmentConfig} from './environment.js' */
/** @import {EnvironmentConfigStyleGuide} from './environment.js' */

const loadingScreen = document.getElementById("FullScreenLoading");
if (loadingScreen) {
  let opacity = 1;
  const fadeStep = 0.02;
  const fadeInterval = 25;

  const outer = setInterval(() => {
    const fadeOut = setInterval(() => {
      opacity -= fadeStep;
      loadingScreen.style.opacity = opacity;

      if (opacity <= 0) {
        clearInterval(fadeOut);
        loadingScreen.style.display = "none";
        loadingScreen.style.pointerEvents = "none";
      }
    }, fadeInterval);
    if (opacity <= 0) clearInterval(outer);
  }, 1000);
}

/** @type {Map<string, WindowConfig>} */
const startupwindows = new Map([
  [
    "welcome",
    {
      height: 700,
      width: 500,
      x: 50,
      y: 50,
      position: "center",
      icon: null,
      title: "Welcome!",
      content: "<p>This is a test</p>",
      initialURL: "/welcome",
      styles: {
        minHeight: "10px",
        minWidth: "10px",
      },
    },
  ],
  [
    "music",
    {
      type: MusicPlayer,
      width: 400,
      height: 400,
      x: 50,
      y: 100,
      position: "center",
      icon: null,
      title: "Music Player",
      content: '<div id="music-player"></div>',
      tracks: [
        {
          title: "Bill_Nye - Tadj Cazaubon & Violet Mirrors",
          url: "/audio/Bill_Nye.wav",
        },
        {
          title: "Grey Skies - Molly",
          url: "/audio/grey_skies.wav",
        },
        {
          title: "Jello - WayKool",
          url: "/audio/jello.mp3",
        },
        {
          title: "Discotheque Diner - Molly",
          url: "/audio/discotheque_diner.wav",
        },
        {
          title: "Weather - Tadj Cazaubon & Violet Mirrors",
          url: "/audio/Weather.wav",
        },
        {
          title: "Jonathan Seagull - Molly",
          url: "/audio/jonathan_seagull.wav",
        },
        {
          title: "Boomer - Violet Mirrors",
          url: "/audio/boomer.wav",
        },
        {
          title: "In Awe of The Machine - Tadj Cazaubon & Violet Mirrors",
          url: "/audio/machine.wav",
        },
      ],
      styles: {
        titlebar_fontsize: "12px",
        minHeight: "10px",
        minWidth: "10px",
      },
    },
  ],
  [
    "projects",
    {
      height: 925,
      width: 730,
      x: 250,
      y: 150,
      position: "cascade",
      icon: null,
      title: "Projects!",
      content: "<p>Projects</p>",
      initialURL: "/projects",
    },
  ],
  [
    "contact",
    {
      height: 500,
      width: 400,
      icon: null,
      title: "Contact",
      content: "<p>Contact</p>",
      initialURL: "/contact",
      styles: {
        minHeight: "550px",
        minWidth: "300px",
      },
    },
  ],
  [
    "about",
    {
      height: 600,
      width: 550,
      posiiton: "center",
      icon: null,
      title: "Who I Am",
      content: "<p>About</p>",
      initialURL: "/about",
      styles: {
        minHeight: "550px",
        minWidth: "300px",
      },
    },
  ],
  [
    "popup",
    {
      height: 100,
      width: 300,
      icon: "/icons/messages.png",
      title: "Message",
      content: "<p>This is a popup message</p>",
      styles: {},
    },
  ],
  [
    "doom",
    {
      height: 600,
      width: 1000,
      icon: "icons/doom.png",
      title: "Doom",
      content: "<p>Doom</p>",
      initialURL: "/doom",
      singleInstance: true,
      styles: {
        minHeight: "10px",
        minWidth: "10px",
      },
    },
  ],
  [
    "secrets",
    {
      height: 300,
      width: 350,
      icon: "icons/secrets.png",
      title: "Secrets",
      content: "<p>secrets</p>",
      initialURL: "/secrets",
      singleInstance: true,
      styles: {
        minHeight: "10px",
        minWidth: "10px",
      },
    },
  ],
]);

/** @type {Map<typeof Window, WindowConfig>} */
const windowDefaults = new Map([
  [
    Window,
    {
      x: 50,
      y: 50,
      icon: null,
      styles: {
        minWidth: 200,
        minHeight: 100,
      },
    },
  ],
  [
    Popup,
    {
      x: 50,
      y: 50,
      icon: null,
      styles: {
        minWidth: 150,
        minHeight: 75,
      },
    },
  ],
  [
    MusicPlayer,
    {
      x: 50,
      y: 50,
      icon: null,
      styles: {
        minWidth: 300,
        minHeight: 200,
      },
    },
  ],
  [
    SecretWindow,
    {
      x: 50,
      y: 50,
      icon: null,
      styles: {
        minWidth: 200,
        minHeight: 100,
      },
    },
  ],
]);

/**@type {EnvironmentConfig} */
const envconfig = {
  windowDefaults: windowDefaults,
  startupWindows: startupwindows,
  iconLoadDelay: 275,
  zIndexBase: 100,
  styles: {},
};

localStorage.removeItem("windowEnvironmentState");
const env = new Environment(envconfig);

/** @type {IconConfig[]} - Default icons to be added to the desktop*/
const icons = [
  {
    title: "Welcome",
    image: "images/clippy.gif",
    onhover: "images/clippy_closeup.gif",
    x: 20,
    y: 50,
    clickhandler: () => env.newWindow(Window, startupwindows.get("welcome")),
  },
  {
    title: "Current Projects",
    image: "icons/console.png",
    onhover: "icons/console.png",
    x: 20,
    y: 175,
    content: "",
    clickhandler: () => env.newWindow(Window, startupwindows.get("projects")),
  },
  {
    title: "Music",
    image: "icons/music.png",
    onhover: "icons/music.png",
    x: 20,
    y: 300,
    clickhandler: () => env.newWindow(MusicPlayer, startupwindows.get("music")),
  },
  {
    title: "Doom",
    image: "icons/doom.png",
    onhover: "icons/doom.png",
    x: 20,
    y: 425,
    clickhandler: () => env.newWindow(Window, startupwindows.get("doom")),
  },
  {
    title: "Secrets",
    image: "icons/secrets.png",
    onhover: "icons/secrets.png",
    x: 20,
    y: 550,
    clickhandler: () =>
      env.newWindow(SecretWindow, startupwindows.get("secrets")),
  },
];

/** @type {TaskbarButtonConfig[]} - Default taskbar buttons to be added to the taskbar*/
const taskbarButtons = [
  {
    title: "Welcome",
    clickhandler: () => env.newWindow(Window, startupwindows.get("welcome")),
  },
  {
    title: "Projects",
    clickhandler: () => env.newWindow(Window, startupwindows.get("projects")),
  },
  {
    title: "Contact",
    clickhandler: () => env.newWindow(Window, startupwindows.get("contact")),
  },
  {
    title: "Source",
    clickhandler: () =>
      window.open("https://github.com/sudoDeVinci/devinci.cloud-frontend"),
  },
  {
    title: "About Me",
    clickhandler: () => env.newWindow(Window, startupwindows.get("about")),
  },
];

env.addTaskbarIcons(taskbarButtons);
env.addDesktopIcons(icons, envconfig.iconLoadDelay);

const windowintl = setInterval(() => {
  window.environment = env;
  window.windowType = Window;
  window.musicPlayerType = MusicPlayer;
  window.popupType = Popup;
  window.welcomeWindowConfig = startupwindows.get("welcome");
  window.musicWindowConfig = startupwindows.get("music");
  window.contactWindowConfig = startupwindows.get("contact");
  window.aboutWindowConfig = startupwindows.get("about");
  window.projectsWindowConfig = startupwindows.get("projects");
  window.popupWindowConfig = startupwindows.get("popup");

  window.aboutWindowConfig["x"] = 120;
  window.aboutWindowConfig["y"] = 80;
  const intl1 = setInterval(() => {
    env.newWindow(Window, window.aboutWindowConfig);
    clearInterval(intl1);
  }, 1000);

  window.welcomeWindowConfig["x"] = 700;
  window.welcomeWindowConfig["y"] = 60;
  const intl2 = setInterval(() => {
    env.newWindow(Window, window.welcomeWindowConfig);
    clearInterval(intl2);
  }, 1250);

  window.musicWindowConfig["x"] = 1000;
  window.musicWindowConfig["y"] = 300;
  const intl3 = setInterval(() => {
    env.newWindow(MusicPlayer, window.musicWindowConfig);
    clearInterval(intl3);
  }, 1500);

  clearInterval(windowintl);
}, 500);
