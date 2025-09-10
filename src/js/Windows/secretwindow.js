import { Window } from './window.js';

/**
 * Windows 98 style music player window component
 * @extends Window
 */
export default class SecretWindow extends Window {
  /**
   * Create a new MusicPlayer window
   * @param {string} id - Window identifier
   * @param {object} config - Window configuration
   */
  constructor(id, config) {
    super(id, {
      ...config,
      title: config.title || 'Secrets',
      width: config.width || 350,
      height: config.height || 300
    });
  }
}
