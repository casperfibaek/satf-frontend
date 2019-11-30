// @ts-nocheck

function sendStringToParentPage() {
  const userName = document.getElementById('name-box').value;
  Office.context.ui.messageParent(userName);
  return null;
}

(function popupInit() {
  Office.onReady().then(() => {
    document.getElementById('ok-button').onclick = sendStringToParentPage;
    document.querySelector('.ms-Dialog-subText').innerText = localStorage.getItem('range');

    const clientID = localStorage.getItem('clientID');
    document.getElementById('name-box').value = clientID;
  });
}());
