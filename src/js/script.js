import Environment from './environment.js'
import {Window, WindowConfig} from './Windows/window.js'

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
    icon: '🔥',
    title: 'Environment Test',
    content: '<p>This is a test</p>'
}

env.newWindow(Window, config)
