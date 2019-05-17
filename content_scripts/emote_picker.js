

function createDOMObject(HTML){
    var d = document.createElement('div');
    d.innerHTML = HTML;
    return d.firstChild;
}

function setEmoteToolTip(emoteSpan, emoteName){
    try{
        var emoteTooltip = emoteSpan.getElementsByClassName('tw-tooltip');
        emoteTooltip.innerText = emoteName;
    }
    catch(e){
        
    }
}

var emote_picker = (function(){

    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", chrome.extension.getURL("html/lock_emote_frame.html"), false );
    xmlHttp.send(null);
    
    var lockEmoteHTML = xmlHttp.responseText;
    var lockEmoteDom = (function(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild; 
    })(lockEmoteHTML);

    function matchLowerCase(a, b)
    {
        return a.toLowerCase().match(b.toLowerCase()) != null;
    }

    //---------------------- INIT --------------------------

    var EmoteAvailableList = null;
    var EmoteIdDict = null;

/*
    chrome.runtime.onMessage.addListener(
        function(request,sender,sendResponse){
            if(request.type == 'emote_list'){
                if(response != null && response.data != null && response.data.error === undefined)
                    EmoteAvailableList = request.data;
                else{
                    EmoteAvailableList = null;
                }
            }
        }
    );
    */

    //------------------- EVENT_HANDLE ----------------------

    var emote_picker = {
        type : 'emote_picker',
        pickerFrame : null,
        contentFrame : null,
        controlFrame : null,
        createFrame : null,
        destroyFrame : null,
        appendPickerFrame : null,
        deletePickerFrame : null,

    }

    var cur_streamer = null;
    var channelEmoteFrame = null;

    //-------------------- SEARCH EMOTE -----------------------

    var searchEmote = {
        list : {'emoticon_sets' : {'0': []}}
    };

    searchEmote.isNull = function()
    {
        return this.list['emoticon_sets'][0].length == 0;
    }

    searchEmote.appendEmote = function(emote)
    {
        this.list['emoticon_sets'][0].push(emote);
    }

    searchEmote.reset = function(){
        this.list = {'emoticon_sets' : {'0': []}};
    }

    var makeSearchingEmoteList = function(Text){
    
        searchEmote.reset();

        var emote_sets = Object.keys(EmoteAvailableList['emoticon_sets']);

        for(var i = emote_sets.length -1 ; i >= 0 ; i --)
        {
            var cur_set = emote_sets[i];

            for(var j = 0 ; j < EmoteAvailableList['emoticon_sets'][cur_set].length ; j ++){
                var cur_emote = EmoteAvailableList['emoticon_sets'][cur_set][j];
                
                var emote_id = cur_emote['id'] ;
                var emote_name = cur_emote['code'];

                if(matchLowerCase(emote_name,Text))
                {
                    searchEmote.appendEmote(cur_emote);
                }
            }
        }
        

    }

    //-------------------- PICKER FRAME -----------------------

    var contentFrame = null;
    
    /*
        전체 이모티콘을 그려주는 함수.
        search 용 이모티콘 뿌려주는 함수와 역할을 같이하고 있다.
    */
   var drawAllEmoteFrame = function(searchText){

        var EmoteList = null;

        if(searchText === undefined || searchText == '')
        {
            EmoteList = EmoteAvailableList;
        }
        else{
            makeSearchingEmoteList(searchText);
            EmoteList = searchEmote.list;
        }

        var emote_sets = Object.keys(EmoteList['emoticon_sets']);

        contentFrame.innerHTML = '';

        for(var i = emote_sets.length -1 ; i >= 0 ; i --)
        {
            var emote_picker_content_block = document.createElement('div');
            emote_picker_content_block.classList.add('emote-picker__content-block');
            emote_picker_content_block.classList.add('nc-relatvie');
            emote_picker_content_block.classList.add('nc-pd-t-1');
            emote_picker_content_block.classList.add('nc-pd-b-2');

            var emoteListDiv = document.createElement('div');
            emoteListDiv.classList.add('tw-flex');
            emoteListDiv.classList.add('tw-flex-wrap');
            emoteListDiv.classList.add('tw-justify-content-center');

            var cur_set = emote_sets[i];

            for(var j = EmoteList['emoticon_sets'][cur_set].length - 1 ; j >= 0; j--){
                var cur_emote = EmoteList['emoticon_sets'][cur_set][j];

                var emote_span = drawEmote(cur_emote,'all');

                emoteListDiv.appendChild(emote_span);
            }

            emote_picker_content_block.appendChild(emoteListDiv);

            
            contentFrame.appendChild(emote_picker_content_block);
        }
    }

    var drawContentFrame = function(){

        contentFrame = document.createElement('div');
            
        if(searchEmote.isNull() != true){
            searchEmote.reset();
        }                 

        drawAllEmoteFrame();

        return contentFrame;
    }

    /*
        single 이모티콘은 최초 호출시에만 새로 DOM 오브젝트를 형성하고
        각 이모티콘 오브젝트의 DOM키에 매핑된다.
    */
    var drawEmote = function(cur_emote, type){

        if(cur_emote['DOM'] === undefined)
        {
            var emote_span = document.createElement('div');
            
            var emote_id = cur_emote['id'] ;
            var emote_name ;
            if(type == 'all') emote_name = cur_emote['code'];
            else if(type == 'channel') emote_name = cur_emote['regex'];
        
            emoteSpanHTML = '<div class="emote-picker__emote"><div class="tw-tooltip-wrapper tw-inline-flex"><button class="emote-picker__emote-link tw-align-items-center tw-flex tw-justify-content-center" aria-label="%name" name="%name" data-a-target="%name"><figure class="emote-picker__emote-figure"><img alt="%name" class="emote-picker__emote-image" src="https://static-cdn.jtvnw.net/emoticons/v1/%emote_id/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/%emote_id/1.0 1.0x, https://static-cdn.jtvnw.net/emoticons/v1/%emote_id/2.0 2.0x, https://static-cdn.jtvnw.net/emoticons/v1/%emote_id/3.0 3.0x"></figure></button><div class="tw-tooltip tw-tooltip--down tw-tooltip--align-center" data-a-target="tw-tooltip-label" role="tooltip">%emote_tooltip</div></div></div>';
            emoteSpanHTML = emoteSpanHTML.replace(/\%name/gi,emote_name);
            emoteSpanHTML = emoteSpanHTML.replace(/\%emote_id/gi,emote_id);
            emoteSpanHTML = emoteSpanHTML.replace(/\%emote_tooltip/gi,emote_name);
        
            emote_span.innerHTML = emoteSpanHTML;

            setEmoteToolTip(emote_span, emote_name);

            var emote_button = emote_span.getElementsByClassName('emote-picker__emote-link')[0];

            if(EmoteIdDict[emote_id] != undefined){
                (function(cur_emote_name){
                    emote_button.addEventListener('click',function(){
                        tcf.addTextToChatInput(cur_emote_name + '&nbsp;');
                    });
                })(emote_name);
            }
            else{
                emote_button.appendChild(lockEmoteDom.cloneNode(true));
            }

        
            cur_emote['DOM'] = emote_span;

            return emote_span;
        }
        else{
            return cur_emote['DOM'];
        }    
    }


    var drawChannelEmoteFrame = function()
    {
        contentFrame.innerHTML = '';

        channelEmotes.forEach(function(channelEmote){
            var emote_picker_content_block = document.createElement('div');
            emote_picker_content_block.classList.add('emote-picker__content-block');
            emote_picker_content_block.classList.add('nc-relatvie');
            emote_picker_content_block.classList.add('nc-pd-t-1');
            emote_picker_content_block.classList.add('nc-pd-b-2');

            var emoteListDiv = document.createElement('div');
            emoteListDiv.classList.add('tw-flex');
            emoteListDiv.classList.add('tw-flex-wrap');
            emoteListDiv.classList.add('tw-justify-content-center');

            var cur_emotes = channelEmote.emoticons;

            cur_emotes.forEach(function(cur_emote){
                var emote_span = drawEmote(cur_emote, 'channel');

                emoteListDiv.appendChild(emote_span);
            });

            emote_picker_content_block.appendChild(emoteListDiv);

            
            contentFrame.appendChild(emote_picker_content_block);
        });

    }

    var drawControlFrame = function(){

        var controlFrame = document.createElement('div');

        var searchFrame = document.createElement('div');
        searchFrame.setAttribute('class', 'tw-border-t  tw-pd-1 nc-pd-1')
        searchFrame.innerHTML = '<div class="tw-relative"><input type="text" class="tw-block tw-border-radius-medium tw-font-size-6 tw-full-width tw-input tw-pd-l-1 tw-pd-r-1 tw-pd-y-05 " placeholder="이모티콘 검색" autocapitalize="off" autocorrect="off" data-a-target="tw-input" value=""></div>'
        
        var search_emote = searchFrame.getElementsByClassName('tw-input')[0];

        search_emote.addEventListener('input', function(e){
           drawAllEmoteFrame(search_emote.value);
        });

        var emoteActiveClass = 'emote-picker__tab--active';
        var tabHTMl = '<div id="nc-emote__%name" class="emote-picker__tab tw-pd-x-1" data-a-target="emote-%name-tab" tabindex="0"><span>%appear</span></div>';
        var emoteAllTabHTML = tabHTMl.replace(/\%name/gi,'all').replace('%appear','전체');
        var emoteChannelTabHTML = tabHTMl.replace(/\%name/gi,'channel').replace('%appear','채널');

        var tabContainer = document.createElement('div');
        tabContainer.setAttribute('class','emote-picker__tabs-container tw-border-t tw-c-background-base');
        var emoteAllTab = createDOMObject(emoteAllTabHTML);
        var emoteChannelTab = createDOMObject(emoteChannelTabHTML);

        emoteAllTab.classList.add(emoteActiveClass);

        tabContainer.appendChild(emoteAllTab);
        emoteAllTab.addEventListener('click',function(){
            emoteAllTab.classList.add(emoteActiveClass);
            emoteChannelTab.classList.remove(emoteActiveClass);
            drawAllEmoteFrame();
        });

        emoteChannelTab.addEventListener('click',function(){
            emoteChannelTab.classList.add(emoteActiveClass);
            emoteAllTab.classList.remove(emoteActiveClass);
            drawChannelEmoteFrame();
        });

        channelProductPromise.then(function(resolve){
            tabContainer.appendChild(emoteChannelTab);
        }).catch(function(error){
            
        })


        controlFrame.appendChild(searchFrame);
        controlFrame.appendChild(tabContainer);
        controlFrame.align = 'left';

        return controlFrame;
    }

    //--------------------------------------------------------------

    var picker = new tcf.picker(
        'emote_picker',
        chrome.runtime.getURL('/emote_picker.png'),
        drawContentFrame,
        drawControlFrame
    );

    picker.setStreamer = function(streamer){
        cur_streamer = streamer;
    }

    picker.setPickerImg(chrome.runtime.getURL('/emote_picker.png'),chrome.runtime.getURL('black_emote_picker.png'));

    
    picker.promise = new Promise(function(resolve, reject){
        chrome.runtime.sendMessage({type:'emote_list'}, function(response)
        {
            if(response != null && response.error === undefined)
            {        
                resolve(true);

                EmoteAvailableList = response;
                EmoteIdDict = {};

                var keys = Object.getOwnPropertyNames(EmoteAvailableList.emoticon_sets);

                for(var i = 0 ; i < keys.length ; i ++)
                {
                    var emoteSet = EmoteAvailableList.emoticon_sets[keys[i]];
        
                    for(var j = 0 ; j < emoteSet.length ; j ++)
                    {
                        EmoteIdDict[emoteSet[j]['id']] = emoteSet[j];
                    }
                }
            }
            else{
                resolve(false);
                EmoteAvailableList = null;
            }
        });
    
    })

    //-------------------- channel product -------------------------

    var channelProductPromise = null;
    var channelEmotes = null;

    picker.init = function(streamer){

        channelProductPromise = new Promise(function(resolve, reject){
            chrome.runtime.sendMessage({type :'channel_product', channel_name : streamer}, function(response){
                if(response != null){                
                    if(response.error != undefined){
                        reject(response.error);
                    }

                    channelEmotes = response.plans;
                    resolve(response);
                }
                else{
                    reject('error');
                }
            })
        });

    }

    picker.reset = function(){
        channelProductPromise = null;
        channelEmotes = null;
    }

    return picker;

})();