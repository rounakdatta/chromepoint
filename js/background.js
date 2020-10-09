function copyToClipboard(text) {
    var input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
}

prepareChromepoint = function(payload) {
    return new Promise(function(resolve, reject) {
        let pinpointedText = payload.selectionText;
        let pinpointedTextEncoded = encodeURI(pinpointedText);
        let currentUrl = payload.pageUrl;
        const regex = /#:~:.+/g;
        currentUrl = currentUrl.replace(regex, '');
        let pinpointedUrl = currentUrl + "#:~:text=" + pinpointedTextEncoded;
        console.log(pinpointedUrl);
        resolve(pinpointedUrl);
    });
};

chromepointToNewTab = function(payload) {
    prepareChromepoint(payload).then(function(chromepointedUrl) {
        chrome.tabs.create({url: chromepointedUrl});
    });
};

chromepointToClipboard = function(payload) {
    prepareChromepoint(payload).then(function(chromepointedUrl) {
        copyToClipboard(chromepointedUrl);
    });
};

chrome.contextMenus.create({
    title: "chromepoint it in a new tab",
    contexts:["selection"],
    onclick: chromepointToNewTab
});

chrome.contextMenus.create({
    title: "chromepoint it to clipboard",
    contexts:["selection"],
    onclick: chromepointToClipboard
});