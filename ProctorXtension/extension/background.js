// Background script to handle background tasks like CORS and sending data to backend.

chrome.runtime.onInstalled.addListener(() => {
    console.log("Behavior Tracker extension installed.");
  });
  
chrome.runtime.onInstalled.addListener(() => {
// Set the initial state of tracking to inactive
chrome.storage.local.set({ isTrackingActive: false });
});
  
  // Listen for changes to the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.action === 'setTrackingState') {
    chrome.storage.local.set({ isTrackingActive: message.state });
}
});
  