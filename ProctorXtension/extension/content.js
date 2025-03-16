chrome.storage.local.get('isTrackingActive', ({ isTrackingActive }) => {
    isTrackingActive = isTrackingActive !== undefined ? isTrackingActive : false;
    console.log("Tracking is active:", isTrackingActive);
  
    // Variables to track the data
    let mouseClicksPerSec = 0;
    let clickDelayVariability = 0;
    let typingWPM = 0;
    let keystrokeDelayVariability = 0;
    let lastClickTime = Date.now();
    let lastKeyTime = Date.now();
    let clickCount = 0;
    let keyPressCount = 0;
    let totalKeyPressTime = 0;
    let totalKeystrokeDelay = 0;
    let tabSwitchDetected = false;
  
    // Track mouse clicks and calculate cps and variability (only when tracking is active)
    document.addEventListener('click', () => {
      if (isTrackingActive) {
        clickCount++;
        const currentTime = Date.now();
        const clickDelay = currentTime - lastClickTime;
        clickDelayVariability = Math.abs(clickDelay - clickDelayVariability) / clickCount;
        lastClickTime = currentTime;
  
        // Update clicks per second
        if (currentTime - lastClickTime <= 1000) {
          mouseClicksPerSec = clickCount;
        }
      }
    });
  
    // Track keyboard activity (WPM and keystroke delay) (only when tracking is active)
    document.addEventListener('keydown', (event) => {
      if (isTrackingActive) {
        const currentTime = Date.now();
        const keystrokeDelay = currentTime - lastKeyTime;
        totalKeystrokeDelay += keystrokeDelay;
        totalKeyPressTime += keystrokeDelay / 1000;  // Convert to seconds
        lastKeyTime = currentTime;
        keyPressCount++;
  
        // Update WPM (words per minute)
        if (keyPressCount > 0) {
          typingWPM = (keyPressCount / totalKeyPressTime) * 60 / 5;  // Approximation of WPM
        }
      }
    });
  
    // Tab switch or exiting fullscreen (only when tracking is active)
    let wasFullscreen = false;
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && wasFullscreen) {
        console.log("Exited fullscreen");
      }
      wasFullscreen = document.fullscreenElement;
    });
  
    // Track tab switching and handle context resetting
    let lastFocusTime = Date.now();
    let lastTabTitle = document.title;
  
    window.addEventListener('focus', () => {
      lastFocusTime = Date.now();
      if (document.title !== lastTabTitle) {
        if (tabSwitchDetected) {
          alert('Tab switch detected!');
          tabSwitchDetected = true;
          console.log("Clearing context due to tab switch");
          resetContext(); // Reset variables
          activateTracking(); // Start tracking when tab becomes active
        } else {
          console.log("Clearing context due to tab switch");
          resetContext(); // Reset variables
        }
      }
    });
  
    window.addEventListener('blur', () => {
      if (isTrackingActive) {
        isTrackingActive = false;
        alert("Tracking paused");
      }
    });
  
    // Function to activate tracking when tab is focused
    function activateTracking() {
      isTrackingActive = true;
      alert("Tracking started");
    }
  
    // Function to reset the tracking context
    function resetContext() {
      if (!document.hidden) {
        mouseClicksPerSec = 0;
        clickDelayVariability = 0;
        typingWPM = 0;
        keystrokeDelayVariability = 0;
        lastClickTime = Date.now();
        lastKeyTime = Date.now();
        clickCount = 0;
        keyPressCount = 0;
        totalKeyPressTime = 0;
        totalKeystrokeDelay = 0;
        tabSwitchDetected = false;
      }
      alert("Context reset");
    }
  
    // Function to send tracked data to the backend (only when tracking is active)
    function sendDataToBackend() {
        if (!isTrackingActive || !document.hidden) {
          return; // Prevent sending data when tracking is inactive or the document is not visible
        }
    
        var behaviorData = {
          "mouse_clicks_per_sec": mouseClicksPerSec,
          "click_delay_variability": clickDelayVariability,
          "typing_wpm": typingWPM,
          "keystroke_delay_variability": totalKeystrokeDelay / keyPressCount,
        };
        alert("Data sent to backend");
        console.log("Sending data to backend:", behaviorData);
    
        fetch('http://localhost:5001/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(behaviorData),
        })
        .then(response => response.json())
        .then(data => {
          console.log("Data sent successfully:", data);
        })
        .catch((error) => {
          console.error("Error in sending data:", error);
        });
      }
    
      // Set up a timer to send data every 2 seconds
      setInterval(() => {
        if (isTrackingActive) {
            console.log("Sending data to backend...");
          sendDataToBackend(); // We send data periodically
        }
      }, 2000); // 2000 ms = 2 seconds
    
      // Ensure tracking starts when the page is focused
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          isTrackingActive = false; // Pause tracking if the page is not visible
          alert("Alt-Tab Detected");
        } else {
          isTrackingActive = true; // Resume tracking if the page is visible
          console.log("Warning: DO not alt-tab");
        }
      });
    });
