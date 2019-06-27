/*
TWITCH DCCON EXTENSTION 
version 1.0.0

developer : 
sfsepark@gmail.com
https://www.twitch.tv/funzzinuu 
*/

//init JSON

var DCCONJSON = null;
var ONOFF = true;

chrome.runtime.sendMessage({
    method: 'POST',
    action: 'xhttp',
    url: 'http://funzinnu.cafe24.com/stream/dccon.php',
    data: ''
}, function(responseText) {
    DCCONJSON = JSON.parse(responseText);
});

chrome.runtime.sendMessage({
    method: 'POST',
    action: 'ONOFF_CHECK'
}, function(responseText) {
    if(responseText == 'false')
    {
        ONOFF = false;
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if(request.action == 'DCCON')
    {
        try{
            document.getElementsByClassName('chat-interface')[0].getElementsByClassName('chat-input')[0].getElementsByClassName('chat_text_input')[0].value = request.name;
        }
        catch(e){}
    }
    if(request.action == 'ONOFF')
    {
        ONOFF = request.toggle;
    }
});
//end of init

var cur_li_id = 'emberXXXX';
var next_li_id = 'emberXXXX';

var reg = /^\s*~(\S+)\s*((\S|\s)*)/;

//dummy target
var target = document;
//dummy observer
var observer = new MutationObserver(function(){});
    
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };

var addChatDetectObserver = function()
{
    observer.disconnect();

    target = document.getElementsByClassName('chat-lines')[0];

    // create an observer instance
    observer = new MutationObserver(function(mutations) {
        chat_detect();  
    });

    // if target node is not loaded, it makes some error.
    try{
        observer.observe(target, config);
        clearInterval(observeInterval);
    }
    catch(e) {}
}

var chat_detect = function(){
    var cur_li = target.lastElementChild;
    next_li_id = cur_li.id;

    var len = target.children.length;

    if(DCCONJSON != null)
    {
        for(var i = len ; i -- ; i >=0)
        {
            var child =  target.children[i];
            //LI check, recent message check, admin message check
            if(child.tagName == 'LI' && cur_li_id != child.id)
            {
                var is_admin = false;

                for(var c in child.classList)
                {
                    if(child.classList[c] == "admin")
                        is_admin = true;
                }
                if(!is_admin)
                    edit_chating(child);
            }
            else{
                break;
            }
        }
        
        cur_li_id = next_li_id;
    }
}

var observeInterval = setInterval(function(){
    addChatDetectObserver();
}, 3000);

var edit_chating = function(chatLI)
{
    var result = reg.exec(chatLI.getElementsByClassName('message')[0].innerHTML);
    if(result != null && DCCONJSON[result[1]] != undefined && ONOFF == true)
    {
        chatLI.getElementsByClassName('message')[0].innerHTML = "<div style =\"height : 10px;\"></div><div style =\"margin-top:2px margin-bottom:2px\"><span class=\"balloon-wrapper\"><img src=\"" + 
        DCCONJSON[result[1]] + "\" alt=\"~" + result[1] + "\" class=\"emoticon\"><div class=\"balloon balloon--tooltip balloon--up balloon--center mg-t-1\">~"+ result[1] +"</div></span></div><div style =\"height : 10px;\"></div>" + result[2];
    }
}
