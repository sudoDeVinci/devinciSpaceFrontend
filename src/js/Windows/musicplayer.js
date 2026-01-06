import { Window } from "./window.js";

/**
 * Windows 98 style music player window component
 * @extends Window
 */
export default class MusicPlayer extends Window {
  /**
   * Create a new MusicPlayer window
   * @param {string} id - Window identifier
   * @param {object} config - Window configuration
   */
  constructor(id, config) {
    super(id, {
      ...config,
      title: config.title || "Win98 Music Player",
      width: config.width || 350,
      height: config.height || 300,
    });

    this.tracks = [];
    this.currentTrackIndex = config.currentTrackIndex || 0;
    this.isPlaying = false;
    this.audio = new Audio();
    this.audio.addEventListener("ended", () => this.next());

    // Initialize player UI
    this.initializePlayer();

    if (config.tracks) {
      for (const track of config.tracks) {
        this.addTrack(track.title, track.url);
      }
    }
  }

  /**
   * Create the music player UI
   */
  initializePlayer() {
    // Clear content area
    this.contentArea.innerHTML = "";
    this.contentArea.style.padding = "10px";
    this.contentArea.style.display = "flex";
    this.contentArea.style.flexDirection = "column";
    this.contentArea.style.gap = "10px";

    // Create player elements
    this.createNowPlaying();
    this.createVolumeControl();
    this.createControls();
    this.createPlaylist();

    // Set initial states
    this.updateNowPlaying();
  }

  /**
   * Creates the "Now Playing" display
   */
  createNowPlaying() {
    const nowPlayingContainer = document.createElement("div");
    nowPlayingContainer.className = "field-row";
    nowPlayingContainer.style.padding = "5px";
    nowPlayingContainer.style.marginBottom = "10px";

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Playing:";
    titleLabel.style.marginRight = "10px";
    titleLabel.style.fontSize = "1rem";

    this.nowPlayingText = document.createElement("div");
    this.nowPlayingText.style.whiteSpace = "nowrap";
    this.nowPlayingText.style.overflow = "hidden";
    this.nowPlayingText.style.textOverflow = "ellipsis";
    this.nowPlayingText.style.minWidth = "0";
    this.nowPlayingText.style.flexGrow = "1";
    this.nowPlayingText.style.display = "inline-block";
    this.nowPlayingText.style.padding = "5px";
    this.nowPlayingText.style.border = "inset 2px";
    this.nowPlayingText.style.backgroundColor = "white";
    this.nowPlayingText.textContent = "No track selected";
    this.nowPlayingText.style.fontSize = "0.75rem";

    nowPlayingContainer.appendChild(titleLabel);
    nowPlayingContainer.appendChild(this.nowPlayingText);
    this.contentArea.appendChild(nowPlayingContainer);
  }

  /**
   * Creates the playback controls
   */
  createControls() {
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "field-row";
    controlsContainer.style.justifyContent = "center";
    controlsContainer.style.gap = "10px";

    // Previous button
    this.prevButton = document.createElement("button");
    this.prevButton.innerHTML = "&#9668;&#9668;";
    this.prevButton.onclick = () => this.previous();

    // Play/Pause button
    this.playButton = document.createElement("button");
    this.playButton.innerHTML = "&#9658;";
    this.playButton.onclick = () => this.togglePlay();

    // Stop button
    this.stopButton = document.createElement("button");
    this.stopButton.innerHTML = "&#9632;";
    this.stopButton.onclick = () => this.stop();

    // Next button
    this.nextButton = document.createElement("button");
    this.nextButton.innerHTML = "&#9658;&#9658;";
    this.nextButton.onclick = () => this.next();

    // Add buttons to controls container
    controlsContainer.appendChild(this.prevButton);
    controlsContainer.appendChild(this.playButton);
    controlsContainer.appendChild(this.stopButton);
    controlsContainer.appendChild(this.nextButton);

    this.contentArea.appendChild(controlsContainer);

    // Add progress bar
    this.createProgressBar();
  }

  /**
   * Creates the progress bar
   */
  createProgressBar() {
    const progressContainer = document.createElement("div");
    progressContainer.style.padding = "5px";
    progressContainer.style.marginTop = "5px";

    this.progressBar = document.createElement("div");
    this.progressBar.className = "progress-indicator";
    this.progressBar.style.width = "100%";
    this.progressBar.style.height = "15px";

    this.progressBarFill = document.createElement("span");
    this.progressBarFill.className = "progress-indicator-bar";
    this.progressBarFill.style.width = "0%";

    this.progressBar.appendChild(this.progressBarFill);
    progressContainer.appendChild(this.progressBar);
    this.contentArea.appendChild(progressContainer);

    // Update progress while playing
    this.audio.addEventListener("timeupdate", () => {
      const percentage = (this.audio.currentTime / this.audio.duration) * 100;
      this.progressBarFill.style.width = `${percentage}%`;
    });

    // Allow clicking on progress bar to seek
    this.progressBar.addEventListener("click", (e) => {
      const rect = this.progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      this.audio.currentTime = this.audio.duration * percent;
    });
  }

  /**
   * Creates the volume control
   */
  createVolumeControl() {
    const volumeContainer = document.createElement("div");
    volumeContainer.className = "field-row";
    volumeContainer.style.padding = "5px";
    volumeContainer.style.alignItems = "center";

    const volumeLabel = document.createElement("button");
    volumeLabel.style.marginRight = "0.5rem";
    volumeLabel.style.maxWidth = "25px";
    volumeLabel.style.maxHeight = "25px";

    const volumeIcon = document.createElement("img");
    volumeIcon.src = "/icons/speaker.png";
    volumeIcon.style.maxWidth = volumeLabel.style.maxWidth;
    volumeIcon.style.maxHeight = volumeLabel.style.maxHeight;
    volumeIcon.style.objectFit = "contain";
    volumeLabel.appendChild(volumeIcon);

    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = "0";
    volumeSlider.max = "100";
    volumeSlider.value = "80";
    volumeSlider.style.flexGrow = "1";
    volumeSlider.addEventListener("input", () => {
      this.audio.volume = parseInt(volumeSlider.value) / 100;
    });

    // Set initial volume
    this.audio.volume = 0.8;

    volumeContainer.appendChild(volumeLabel);
    volumeContainer.appendChild(volumeSlider);
    this.contentArea.appendChild(volumeContainer);
  }

  /**
   * Creates the playlist UI
   */
  createPlaylist() {
    const playlistContainer = document.createElement("div");
    playlistContainer.style.flexGrow = "1";
    playlistContainer.style.overflow = "auto";
    playlistContainer.style.border = "inset 2px";
    playlistContainer.style.backgroundColor = "white";
    playlistContainer.style.padding = "5px";
    playlistContainer.style.minHeight = "80px";

    this.playlistElement = document.createElement("ul");
    this.playlistElement.style.listStyleType = "none";
    this.playlistElement.style.padding = "0";
    this.playlistElement.style.margin = "0";

    playlistContainer.appendChild(this.playlistElement);
    this.contentArea.appendChild(playlistContainer);
  }

  /**
   * Add a track to the playlist
   * @param {string} title - The title of the track
   * @param {string} url - The URL to the audio file
   */
  addTrack(title, url) {
    const track = { title, url };
    this.tracks.push(track);

    // Create playlist item
    const listItem = document.createElement("li");
    listItem.style.padding = "5px";
    listItem.style.cursor = "pointer";
    listItem.textContent = title;
    listItem.style.fontSize = "0.75rem";

    // Highlight current track
    if (this.tracks.length - 1 === this.currentTrackIndex) {
      listItem.style.backgroundColor = "#0000AA";
      listItem.style.color = "white";
    }

    // Click to play
    listItem.addEventListener("click", () => {
      this.currentTrackIndex = this.tracks.indexOf(track);
      this.loadTrack();
      this.play();
      this.updatePlaylist();
    });

    this.playlistElement.appendChild(listItem);

    // If this is the first track, load it
    if (this.tracks.length === 1) {
      this.loadTrack();
    }
  }

  /**
   * Updates the playlist highlighting
   */
  updatePlaylist() {
    const items = this.playlistElement.querySelectorAll("li");
    items.forEach((item, index) => {
      if (index === this.currentTrackIndex) {
        item.style.backgroundColor = "#0000AA";
        item.style.color = "white";
      } else {
        item.style.backgroundColor = "";
        item.style.color = "";
      }
    });
  }

  /**
   * Updates the "Now Playing" display
   */
  updateNowPlaying() {
    if (this.tracks.length === 0) {
      this.nowPlayingText.textContent = "No track selected";
      return;
    }

    const currentTrack = this.tracks[this.currentTrackIndex];
    this.nowPlayingText.textContent = currentTrack.title;
  }

  /**
   * Load the current track
   */
  loadTrack() {
    if (this.tracks.length === 0) return;

    const track = this.tracks[this.currentTrackIndex];
    this.audio.src = track.url;
    this.audio.load();
    this.updateNowPlaying();
  }

  /**
   * Play the current track
   */
  play() {
    if (!this.audio.src) this.loadTrack();

    this.audio.play();
    this.isPlaying = true;
    this.playButton.innerHTML = "&#10074;&#10074;"; // Pause symbol
    this.updateNowPlaying();
  }

  /**
   * Pause the current track
   */
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.playButton.innerHTML = "&#9658;"; // Play symbol
    this.updateNowPlaying();
  }

  /**
   * Toggle between play and pause
   */
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Stop playback
   */
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    this.playButton.innerHTML = "&#9658;"; // Play symbol
    this.updateNowPlaying();
  }

  /**
   * Play the next track
   */
  next() {
    if (this.tracks.length === 0) return;

    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.loadTrack();
    this.updatePlaylist();

    if (this.isPlaying) {
      this.play();
    }
  }

  /**
   * Play the previous track
   */
  previous() {
    if (this.tracks.length === 0) return;

    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack();
    this.updatePlaylist();

    if (this.isPlaying) {
      this.play();
    }
  }

  /**
   * Clean up resources when the window is destroyed
   */
  destroy() {
    this.audio.pause();
    this.audio.src = "";
    super.destroy();
  }
}
