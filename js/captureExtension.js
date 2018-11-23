let extensionInstalled = false;

document.getElementById('openScreen').addEventListener('click', () => {
  if (!extensionInstalled) {
    alert(
      'Please install the extension to capture the screen.\n https://chrome.google.com/webstore/detail/screensharing-extension/dlkkcgjmjmkjbnjfgadmkboemfdooclm'
    );
  }
  window.postMessage({ type: 'SS_UI_REQUEST', text: 'start' }, '*');
});

window.addEventListener('message', event => {
  const { data: { type, streamId }, origin } = event;
  if (origin !== window.location.origin) {
    console.warn(
      'ScreenStream: you should discard foreign event from origin:',
      origin
    );
  }

  if (type === 'SS_PING') {
    extensionInstalled = true;
  }

  if (type === 'SS_DIALOG_SUCCESS') {
    startScreenStreamFrom(streamId);
  }

  if (type === 'SS_DIALOG_CANCEL') {
    console.log('User cancelled!');
  }

  if (type === 'screen') {
    console.log('screen!');
  }
});

function startScreenStreamFrom(streamId) {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: streamId,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height
        }
      }
    })
    .then(stream => {
      videoElement = document.getElementById('videoElement');
      videoElement.srcObject = stream;
    })
    .catch(console.error);
    document.getElementsByClassName("transparent")[0].style.display = "none";
    document.getElementsByClassName("divTable")[0].style.display = "none";
    document.getElementsByClassName("buttonScreen")[0].style.display = "block";
    document.getElementById('videoElement').style.display = 'block';
}