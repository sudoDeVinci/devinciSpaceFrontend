import Environment from './environment.js'
import {Window} from './Windows/window.js'
import MusicPlayerWindow from './Windows/musicplayer.js';

/** @import {WindowConfig} from './Windows/window.js' */
/** @import {IconConfig} from './Icon.js' */

// Clear any existing state if needed
localStorage.removeItem('windowEnvironmentState')

// Create environment with autoRestore true
const env = new Environment(true)
env.clearSavedState()

/**
 * Create a new window with the following configuration
 * @type {WindowConfig}
 */
const welcomeWindowConfig = {
    height: 755,
    width: 600,
    x: 125,
    y: 50,
    icon: null,
    title: 'Welcome!',
    content: '<p>This is a test</p>',
    initialURL: '/welcome'
}

const contactWindowConfig = {
    height: 500,
    width: 400,
    icon: null,
    title: 'Contact',
    content: '<p>Contact</p>',
    initialURL: '/contact'
}

const projectWindowConfig = {
    height: 925,
    width: 730,
    x: 750,
    y: 50,
    icon: null,
    title: 'Projects!',
    content: '<p>Projects</p>',
    initialURL: '/projects'
}

const musicWindowConfig = {
    width: 400,
    height: 400,
    x: 1500,
    y: 50,
    icon: null,
    title: 'Win98 Music Player',
    content: '<div id="music-player"></div>',
    tracks: [{title: 'BOOMER',
              url: '/audio/boomer.wav'},
             {title: 'In Awe of The Machine',
              url: '/audio/machine.wav'},
             {title: 'Jello By WayKool',
              url: '/audio/jello-waykool.mp3'},
             {title: 'Weather',
              url: '/audio/Weather.wav'}],
    styles: {
      titlebar_fontsize: '12px'
    }
}

//const window = env.newWindow(Window, welcomeWindowConfig)

//const projectWindow = env.newWindow(Window, projectWindowConfig)


const contactWindow = env.newWindow(Window, contactWindowConfig)

/**
 * Create a new MusicPlayerWindow
 * @type {MusicPlayerWindow}
 */
//const musicPlayer = env.newWindow(MusicPlayerWindow, musicWindowConfig)