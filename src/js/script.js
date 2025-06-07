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



const welcomeWindowConfig = env.defaultConfigs.get("welcome")
env.newWindow(Window, welcomeWindowConfig)


const projectWindowConfig = env.defaultConfigs.get("projects")
//const projectWindow = env.newWindow(Window, projectWindowConfig)


const contactWindowConfig = env.defaultConfigs.get("contact")
//const contactWindow = env.newWindow(Window, contactWindowConfig)


const musicWindowConfig = env.defaultConfigs.get("music")
//const musicPlayer = env.newWindow(MusicPlayerWindow, musicWindowConfig)

export {env}