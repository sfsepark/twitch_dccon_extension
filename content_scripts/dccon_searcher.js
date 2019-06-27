/*
TWITCH DCCON EXTENSTION 
version 1.0.0

developer : 
sfsepark@gmail.com
https://www.twitch.tv/funzzinuu 
*/

//data for chat-crawling
var chatMessage = "";

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
            if(chatMessage == 'message')
                document.getElementsByClassName('chat-interface')[0].getElementsByClassName('chat-input')[0].getElementsByClassName('chat_text_input')[0].value = request.name;
            else if(chatMessage == 'chat-message-text')
                document.getElementsByClassName('chat-input')[0].getElementsByClassName('tw-textarea')[0].value = request.name;
            else if(chatMessage == 'qa-mod-message')
                document.getElementsByClassName('video-chat__input')[0].getElementsByClassName('form__input')[0].value = request.name;
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

    //origin
    target_lists = document.getElementsByClassName('chat-lines');
    chatMessage = 'message';
    if(target_lists.length == 0)
    {
        //twitch_beta 
        target_lists = document.getElementsByClassName('chat-list__lines');
        chatMessage = 'chat-message-text';
    }
    if(target_lists.length == 0)
    { 
        //clip,video chatting
        target_lists = document.getElementsByClassName('video-chat--full-height')[0].getElementsByClassName('align-items-end');
        chatMessage = 'qa-mod-message';
    }

    if(target_lists.length != 0)
    {
        target = target_lists[0];

        // create an observer instance
        observer = new MutationObserver(function(mutations) {
            chat_detect();  
        });

        observer.observe(target, config);
        clearInterval(observeInterval);
    }
 
}

var chat_detect = function(){

    if(DCCONJSON != null)
    {
        if(chatMessage == 'message')
        {
            var cur_li = target.lastElementChild;
            next_li_id = cur_li.id;
        
            var len = target.children.length;

            for(var i = len ; i -- ; i >=0)
            {
                var child =  target.children[i];

                if(cur_li_id != child.id)
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
        else if(chatMessage == 'chat-message-text')
        {
            for(var i = target.children.length - 3; i -- ; i == 0)
            {
                var child = target.children[i];

                if(child.getAttribute('dccon_changed') == 'true')
                {
                    break;
                }
                else{
                    child.setAttribute('dccon_changed','true');

                    for(var c in child.classList)
                    {
                        if(child.classList[c] == "chat-line__message")
                            edit_chating(child);              
                    }
                }               
            }
        }
        else if(chatMessage == 'qa-mod-message')
        {
            for(var i = target.children.length; i -- ; i == 0)
            {
                var child = target.children[i];

                if(child.getAttribute('dccon_changed') == 'true')
                {
                    break;
                }
                else{
                    child.setAttribute('dccon_changed','true');
                    edit_chating(child);              
                }               
            }
        }
    }
}

var edit_chating = function(chatLI)
{
    var messageSpan ;

    if(chatMessage == 'message')
    {
        messageSpan = chatLI.getElementsByClassName(chatMessage)[0];
    }
    else if(chatMessage == 'chat-message-text')
    {
        for(var c in chatLI.children)
        {
            if(chatLI.children[c].getAttribute('data-a-target') == chatMessage)
            {
                messageSpan = chatLI.children[c] ;
                break;
            }
        }
    }
    else if(chatMessage == 'qa-mod-message')
    {
        messageSpan = chatLI.getElementsByClassName(chatMessage)[0];
        messageSpan = messageSpan.children[0];
    }
    

    var result = reg.exec(messageSpan.innerHTML);
    if(result != null && DCCONJSON[result[1]] != undefined && ONOFF == true)
    {
        messageSpan.innerHTML = "<div style =\"height : 10px;\"></div><div style =\"margin-top:2px margin-bottom:2px\"><span class=\"balloon-wrapper\"><img src=\"" + 
        DCCONJSON[result[1]] + "\" alt=\"~" + result[1] + "\" class=\"emoticon\"><div class=\"balloon balloon--tooltip balloon--up balloon--center mg-t-1\">~"+ result[1] +"</div></span></div><div style =\"height : 10px;\"></div>" + result[2];
    }
}


//-------------------start of routine---------------------------

var observeInterval = setInterval(function(){
    addChatDetectObserver();
}, 3000);