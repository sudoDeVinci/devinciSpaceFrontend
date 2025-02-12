import Environment from './environment.js'
import Window from './window.js'

// Clear any existing state if needed
localStorage.removeItem('windowEnvironmentState')

// Create environment with autoRestore true
const env = new Environment(true)
env.clearSavedState()

/*
const config = {
    height: 300,
    width: 400,
    icon: '🔥',
    title: 'Environment Test',
    content: '<p>This is a test</p>'
}

env.newWindow(Window, config)
*/