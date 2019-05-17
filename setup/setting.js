if(chrome.extension === undefined){
    chrome.extension = {};
    chrome.extension.getURL = chrome.runtime.getURL;
}