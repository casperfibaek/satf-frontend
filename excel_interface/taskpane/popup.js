"use strict";
function sendStringToParentPage() {
    var userName = document.getElementById('name-box').value;
    Office.context.ui.messageParent(userName);
    return null;
}
(function popupInit() {
    Office.onReady().then(function () {
        document.getElementById('ok-button').onclick = sendStringToParentPage;
        document.querySelector('.ms-Dialog-subText').innerText = localStorage.getItem('range');
        var clientID = localStorage.getItem('clientID');
        document.getElementById('name-box').value = clientID;
    });
}());
