const button = document.getElementById("toggleTracking");
button.addEventListener("click", () => {
  chrome.storage.local.get('isTrackingActive', ({ isTrackingActive }) => {
    const newState = !isTrackingActive;
    chrome.runtime.sendMessage({ action: 'setTrackingState', state: newState });
  });
});
