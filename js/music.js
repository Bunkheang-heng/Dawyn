const YT_VIDEO_ID = '1mVogXexCZg';

let ytPlayer = null;
let musicPlaying = false;
let userWantsMusic = true;

function createPlayer() {
  ytPlayer = new YT.Player('yt-player', {
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      loop: 1,
      playlist: YT_VIDEO_ID,
      playsinline: 1,
      modestbranding: 1,
    },
    events: {
      onStateChange: event => {
        if (event.data === 1) {
          musicPlaying = true;
          document.getElementById('music-icon').textContent = '❚❚';
        } else if (event.data === 2 || event.data === 0) {
          musicPlaying = false;
          document.getElementById('music-icon').textContent = '▶';
          if (event.data === 0 && userWantsMusic) ytPlayer.playVideo();
        }
      },
    },
  });
}

export function playMusic() {
  userWantsMusic = true;
  if (ytPlayer?.playVideo) ytPlayer.playVideo();
}

export function pauseMusic() {
  userWantsMusic = false;
  if (ytPlayer?.pauseVideo) ytPlayer.pauseVideo();
}

export function initMusic() {
  window.onYouTubeIframeAPIReady = createPlayer;
  if (window.YT?.Player) createPlayer();

  document.getElementById('music-btn').addEventListener('click', () => {
    if (musicPlaying) pauseMusic();
    else playMusic();
  });
}
