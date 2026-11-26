// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  const percent = Math.max(3, Math.round(event.detail.totalProgress * 100));
  updatingBar.style.width = `${percent}%`;
  progressBar.classList.remove('hide');

  if (event.detail.totalProgress >= 1) {
    progressBar.classList.add('hide');
  }
};

const viewer = document.querySelector('model-viewer');
viewer.addEventListener('progress', onProgress);
window.addEventListener('load', () => {
  const progressBar = viewer.querySelector('.progress-bar');
  progressBar.classList.remove('hide');
});