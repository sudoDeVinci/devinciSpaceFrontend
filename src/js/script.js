import Environment from './environment.js'
import {Window} from './Windows/window.js'

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
const config = {
    height: 300,
    width: 400,
    icon: null,
    title: 'Environment Test',
    content: '<p>This is a test</p>'
}

env.newWindow(Window, config)
