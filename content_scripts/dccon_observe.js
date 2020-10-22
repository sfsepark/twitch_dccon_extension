/*
    TWITCH DCCON EXTENSTION 
    version 1.5

    Main developer : sfsepark@gmail.com
    DCCON selector developer : funzinnu@gmail.com
    Jassist-Open-DCCON developer : rishubil@gmail.com
*/
var dcconObserver = function(streamer,DCCONJSON){
    //init JSON

    var ONOFF = true;

    chrome.runtime.onMessage.addListener(function(request, sender, callback) {
        if(request.action == 'DCCON')
        {
            tcf.addTextToChatInput(request.name + ' ');
        }
        if(request.action == 'ONOFF')
        {
            ONOFF = request.toggle;
        }
    });
    //end of init


    //var reg = /((?:\S|\s)*)~(\S+)\s*((?:\S|\s)*)/;
    var dccon_search_reg = /~(\S+)\s*/;

    function check_already_DCCON_converted(messageSpan){
        return messageSpan.parentElement.getElementsByClassName('chat-dccon').length > 0
    }


    function DCCON_edit_chat(type,messageSpan)
    {
        if(!check_already_DCCON_converted(messageSpan) && type == 'text')
        {
            var cur_html = '';
            var cur_text = messageSpan.innerText;
            var result = cur_text.split(dccon_search_reg);

            var dccon_convert_count = 0;
    
            for(var j = 0 ; j < result.length ; j ++)
            {
                if(j %2 == 1)   {

                    if(dccon_convert_count == 0){
                        let converted_html = DCCON_converted(result[j]);
                        cur_html += converted_html;

                        if(typeof(converted_html) == 'string' && converted_html[0] != '~'){
                            dccon_convert_count ++;
                        }
                    }
                    else{
                        cur_html += '~' + result[j] + ' ';
                    }

                }
                else{
                    cur_html += htmlEntityEnc(result[j]);
                }
            }
    
            messageSpan.innerHTML = cur_html;
    
            var dccon = messageSpan.getElementsByClassName('chat-dccon');
            
            
            for(var j = 0 ; j < dccon.length ; j ++)
            {
                (function(_j){
                dccon[_j].addEventListener('click',function(){
                    tcf.addTextToChatInput(dccon[_j].getAttribute('data') + ' ');
                });})(j);
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

        cur_dccon = GET_DCCON(Text);

        if(cur_dccon == undefined ) 
            return '~' + converted_Text + ' ';
        
        /*

        <div class="tw-tooltip-wrapper inline" data-a-target="emote-name"><img src="http://puu.sh/sYGQM/1887cb7d57.gif" alt="~우리핵박수1" class="emoticon" style="width:100px; height:100px"><div class="tw-tooltip tw-tooltip--up tw-tooltip--align-center" data-a-target="tw-tooltip-label" style="margin-bottom: 0.9rem; display: block; visibility: visible;">~우리핵박수1</div></div>
    */

        messageHTML = "<div class='chat-dccon' data='~" + Text + "' style =\"margin-top:4px; margin-bottom:4px; height:" + height + "px;\"><div class=\"tw-tooltip-wrapper tw-inline-block chat-line__message--emote chat-image\" data-a-target=\"emote-name\"><img src=\"" + 
        cur_dccon + "\" alt=\"~" + Text + "\" class=\"emoticon\" style=\"width:" + width + "px; height:" + height +"px\"><div class=\"tw-tooltip tw-tooltip--up tw-tooltip--align-center\" data-a-target=\"tw-tooltip-label\" style=\"margin-bottom: 0.9rem;\">~"+ Text +"</div></div></div>";    
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


    return DCCON_edit_chat;

}
