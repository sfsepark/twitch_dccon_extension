/**
 * Possible parameters for request:
 *  action: "xhttp" for a cross-origin HTTP request
 *  method: Default "GET"
 *  url   : required, but not validated
 *  data  : data to send in a POST request
 *
 * The callback function is called upon completion of the request */

var onoff_togle = true;

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            callback(xhttp.responseText);
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            callback('err');
        };
        xhttp.open(method, request.url, true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhttp.send(request.data);
        return true; // prevents the callback from being called too early on return
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "ONOFF_CHECK") {
        if(onoff_togle == true)
            callback('true');
        else
            callback('false');
        return true;
    }
});


function ONOFF(info)
{
    chrome.tabs.query({"status":"complete","windowId":chrome.windows.WINDOW_ID_CURRENT,"active":true}, function(tabs){
        onoff_togle = !onoff_togle;
        chrome.tabs.sendMessage(tabs[0].id, {'action' : "ONOFF", 'toggle' : onoff_togle});
    });
}

chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  title: "ONOFF", 
  type:"checkbox",
  checked:true,
  contexts:["browser_action"], 
  onclick:  ONOFF
});
