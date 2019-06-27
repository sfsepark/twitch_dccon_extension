/*
TWITCH DCCON EXTENSTION 
version 1.3.5

Main developer : sfsepark@gmail.com
DCCON selector developer : funzinnu@gmail.com
Jassist-Open-DCCON developer : rishubil@gmail.com
*/


//data for chat-crawling
var chatMessage = "";

//init JSON

var DCCONJSON = null;
var ONOFF = true;

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

//var reg = /((?:\S|\s)*)~(\S+)\s*((?:\S|\s)*)/;
var reg = /~(\S+)\s*/;

//dummy target
var target = document;
//dummy observer
var observer = new MutationObserver(function(){});
    
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };

var addChatDetectObserver = function()
{
    //origin(regacy)
    target_lists = document.getElementsByClassName('chat-lines');
 
    if(target_lists.length != 0)
    {
        chatMessage = 'message';
    }
    else
    {
        //twitch(new) 
        target_lists = document.getElementsByClassName('chat-list__lines');

        if(target_lists.length != 0)
        { 
            target_lists = target_lists[0].getElementsByClassName('simplebar-content');
            target_lists = target_lists[0].getElementsByClassName('full-height');
            
            if(target_lists.length == 0)
            {
                target_lists = document.getElementsByClassName('chat-list__lines');
                target_lists = target_lists[0].getElementsByClassName('simplebar-content');
                target_lists = target_lists[0].getElementsByClassName('tw-full-height');
            }
            chatMessage = 'chat-message-text';
        }
        else
        {
            //clip,video chatting
            target_lists = document.getElementsByClassName('qa-vod-chat');
            if(target_lists.length != 0)
            {
                target_lists = target_lists[0].getElementsByClassName('tw-align-items-end');
                chatMessage = 'qa-mod-message';
            }
            else
            {
                chatMessage = '';
            }
        }
    }


    if(target_lists.length != 0)
    {
        if(target != target_lists[0])
        {
            observer.disconnect();  

            target = target_lists[0];
            
            // create an observer instance
            observer = new MutationObserver(function(mutations) {
                chat_detect();  
            });
    
            observer.observe(target, config);
        }  
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

            for(var i = len - 1 ; i >= 0 ; i --)
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
            var child = target.children;
            var len = child.length;

            for(var i = len - 1 ; i >= 0 ; i --)
            {
                if(child[i].getAttribute('dccon_changed') == 'true')
                {
                    break;
                }
                else{
                    child[i].setAttribute('dccon_changed','true');

                    for(var c in child[i].classList)
                    {
                        if(child[i].classList[c] == "chat-line__message")
                            edit_chating(child[i]);              
                            break;
                    }
                }            
            }  

        }
        else if(chatMessage == 'qa-mod-message')
        {
            for(var i = target.children.length - 1; i >= 0; i --)
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
    if(ONOFF == true)
    {
        var messageSpan = [] ;

        if(chatMessage == 'message')
        {
            messageSpan.push(chatLI.getElementsByClassName(chatMessage)[0]);
        }
        else if(chatMessage == 'chat-message-text')
        {
            var len = chatLI.children.length

            for(i = 0 ; i < len ; i ++)
            {
                if(chatLI.children[i].getAttribute('data-a-target') == chatMessage)
                {
                    messageSpan.push(chatLI.children[i]);
                }
            }
            
        }
        else if(chatMessage == 'qa-mod-message')
        {
            var tmpSpan = chatLI.getElementsByClassName(chatMessage)[0].children;
            for(i = 0 ;i < tmpSpan.length; i ++){
                if(tmpSpan[i].getAttribute('data-a-target') != 'emote-name')
                {
                    messageSpan.push(tmpSpan[i]);
                }
            }
        }

        for(i = 0 ; i < messageSpan.length ; i ++)
        {
            var cur_html = '';
            var cur_text = messageSpan[i].innerText;
            var result = cur_text.split(reg);

            for(var j = 0 ; j < result.length ; j ++)
            {
                if(j %2 == 1)   {
                    cur_html += DCCON_converted(result[j]);
                }
                else{
                    cur_html += htmlEntityEnc(result[j]);
                }
            }

            messageSpan[i].innerHTML = cur_html;
        }


    }
}

var ratio = 100.0;

// style=\"width:20%; height:20%\"

var DCCON_converted = function(Text)
{
    var converted_Text = Text;

    var width = 100 * ratio / 100;
    var height = 100 * ratio / 100;

    var cur_dccon ; 

    if(streamer == 'funzinnu')
    {
        if(DCCONJSON[Text] != undefined)   {
            cur_dccon = DCCONJSON[Text];
        }
        else {
            return '~' + converted_Text;
        }
    }
    else
    {
        cur_dccon = GET_DCCON(Text);

        if(cur_dccon == undefined ) 
            return '~' + converted_Text;
    }
    /*

    <div class="tw-tooltip-wrapper inline" data-a-target="emote-name"><img src="http://puu.sh/sYGQM/1887cb7d57.gif" alt="~우리핵박수1" class="emoticon" style="width:100px; height:100px"><div class="tw-tooltip tw-tooltip--up tw-tooltip--align-center" data-a-target="tw-tooltip-label" style="margin-bottom: 0.9rem; display: block; visibility: visible;">~우리핵박수1</div></div>
*/

    messageHTML = "<div style =\"height : 0px;\"></div><div style =\"margin-top:4px; margin-bottom:4px; height:" + height + "px;\"><div class=\"tw-tooltip-wrapper inline\" data-a-target=\"emote-name\"><img src=\"" + 
    cur_dccon + "\" alt=\"~" + Text + "\" class=\"emoticon\" style=\"width:" + width + "px; height:" + height +"px\"><div class=\"tw-tooltip tw-tooltip--up tw-tooltip--align-center\" data-a-target=\"tw-tooltip-label\" style=\"margin-bottom: 0.9rem;\">~"+ Text +"</div></div></div><div style =\"height : 0px;\"></div>";    
    converted_Text = messageHTML;
   
    return converted_Text;
}

var GET_DCCON = function(str)
{
    var dccons = DCCONJSON.dccons;
    var len = dccons.length;

    for(var i = 0 ; i < len ; i ++)
    {
        key_len = dccons[i]['keywords'].length;
        for(var j = 0 ; j < key_len ; j ++)
        {
            if(dccons[i]['keywords'][j] == str)
            {
                return dccons[i]['path'];
            }
        }
    }

    return null;
}

function htmlEntityEnc(str){
    if(str == "" || str == null){
        return str;
    }
    else{
        return str.replace("&", "&amp;").replace("#", "&#35;").replace("<", "&lt;").replace(">", "&gt;").replace(/"/g, "&quot;").replace('\\', "&#39;").replace('%', "&#37;").replace('(', "&#40;").replace(')', "&#41;").replace('+', "&#43;").replace('/', "&#47;").replace('.', "&#46;");
    }
}

//-------------------start of routine---------------------------

var streamer = '';

var observeInterval;

var chat_header_class = [['chat__header', 'chat__header-channel-name'], ['chat-room__header', 'chat-room__header-channel-name']];

var channelDectectInterval = setInterval(function() {
    
    var cur_streamer = '';

    //chat_header
    var chat_header = [];
    
    for(var index = 0 ; index < chat_header_class.length ; index ++)
    {
        chat_header = document.getElementsByClassName(chat_header_class[index][0]);

        if(chat_header.length != 0)
        {
            var len = chat_header[0].children.length

            for(var i = 0 ;i < len ; i ++)
            {
                if(chat_header[0].children[i].getAttribute('data-a-target') == chat_header_class[index][1])
                {
                    cur_streamer = chat_header[0].children[i].innerText;
                    break;
                }
            }
        }
    }

    //channel_header
    if(cur_streamer == '')
    {
        var channel_header = document.getElementsByClassName('channel-header');
    
        if(channel_header.length != 0)
        {
            var channel_header_user = channel_header[0].getElementsByClassName('channel-header__user')[0];
            var channel_user_name = channel_header_user.getAttribute('href');
            try{
                cur_streamer = channel_user_name.substring(1);
            } catch(err){}
        }
    }
    
    // from URL
    if(cur_streamer == '')
    {
        var url = location.href;
        var path_name_regex = /(^[^&?#]+)/g;
        var res = url.match(path_name_regex);
        var url_regex = /\/([^\/]+)/g;
        res = res[0].match(url_regex);

        try{
            if(res.length > 0)
                if(res[1] == '/popout')
                {
                    cur_streamer = res[2].substring(1);
                }
                else{
                    cur_streamer = res[1].substring(1);
                }   
        } catch(err){}
    }

    if(cur_streamer == '')
    {
        streamer = '';
        DCCONJSON = null;
        observer.disconnect();
        clearInterval(observeInterval);
    }
    else
    {
        if(cur_streamer != streamer)
        {
            var JSONURL = '';
            streamer = cur_streamer;

            DCCONJSON = null;
            observer.disconnect();
            clearInterval(observeInterval);
            target = document;

            chrome.runtime.sendMessage({
                method: 'GET',
                action: 'xhttp',
                url: 'https://open-dccon-selector.update.sh/api/dccon-url?channel_name=' + cur_streamer,
                data: ''
            }, function(responseText) {
                JSONURL = JSON.parse(responseText);

                if(JSONURL['user_id'] != null)
                {
                    observeInterval = setInterval(function(){
                        addChatDetectObserver();
                    }, 2000);

                    if(cur_streamer == 'funzinnu') {
                        JSONURL = 'http://funzinnu.cafe24.com/stream/dccon.php';
                    }
                    else  {
                        JSONURL = JSONURL['dccon_url'];
                    }

                    chrome.runtime.sendMessage({
                        method: 'GET',
                        action: 'xhttp',
                        url: JSONURL,
                        data: ''
                    }, function(responseText) {
                        DCCONJSON = JSON.parse(responseText);
                    });
                }
            });
        }
    }
    
}, 1500)

//--------------------end of routine---------------------------------