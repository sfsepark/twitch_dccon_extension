var funzinnu_dccon_picker = (function() {

    var DCCONJSON;

    var DCCON_CONTENT_FRAME_CLASS = 'dccon_content_frame';
    var DCCON_CONTROL_FRAME_CLASS = 'dccon_control_frame';

    var contentFrame = null;
    
    var drawContentFrame = function()
    {
        contentFrame = document.createElement('div');
        contentFrame.classList.add('dccon_frame');
        contentFrame.classList.add(DCCON_CONTENT_FRAME_CLASS );
        contentFrame.innerHTML = '\
            <script id="dccon-template" type="text/x-handlebars-template">\
            {{#dccon}}\
            <div class="img tw-tooltip-wrapper">\
                <div class=\"dccon_tooltip tw-tooltip tw-tooltip--up tw-tooltip--align-center\" data-a-target=\"tw-tooltip-label\" style=\"margin-bottom: 0.9rem;\">{{name}}</div>\
                <a href="#">\
                <img class="lazy dccon_img" src="{{src}}" alt="{{name}}">\
                </a>\
                <div class="desc">{{name}}</div>\
            </div>\
            {{/dccon}}\
            </script>\
            <div class="loading">로딩 중...</div>\
            <div id="emoticon" class="emoticon">\
            </div>\
        ';

        return contentFrame;
    }


    var drawControlFrame = function(){
        var controlFrame = document.createElement('div');
        controlFrame.classList.add('dccon_frame');
        controlFrame.classList.add(DCCON_CONTROL_FRAME_CLASS);
        controlFrame.classList.add(DCCON_CONTROL_FRAME_CLASS);
        controlFrame.classList.add('tw-border-t');
        controlFrame.classList.add('tw-pd-1');

        controlFrame.innerHTML = '\
            <div class="col-lg-6l">\
                <div class="input-group">\
                <input type="text" id="dcconsearch" class="form-control dcconsearch" placeholder="검색">\
                <span class="input-group-btn">\
                    <button class="btn btn-default" type="button">전체</button>\
                </span>\
                </div>\
            </div>\
        ';

        return controlFrame;
    }
    //----------------------------------

    var dcconimage = null;
    var dccondata = {dccon : []};

    var  initChatInject = function(){

        dcconimage = DCCONJSON;
        dccondata.dccon = [];

        if(dcconimage != null)
        {
            for(var i = 0 ; i < Object.keys(dcconimage).length ; i ++)
            {
                dccondata.dccon.push({
                    name : Object.keys(dcconimage)[i],
                    src : dcconimage[Object.keys(dcconimage)[i]]
                });
            }

            setTimeout(LoadDCCon, 10);
            
        }
    }

    var LoadDCCon = function() {

        try {
            var source = $('#dccon-template').html();
            var template = Handlebars.compile(source);
            var html = template(dccondata);
            $('#emoticon').html(html);
            var qs = $('input#dcconsearch').quicksearch('div#emoticon div.img', {
                'delay': 30,
                'selector': 'div.desc',
                'onAfter': function () {
                    $('#dccon-template').scroll();
                }
            });

            $("#simplebar-content").trigger("scroll");
            var imgs = funzpicker.contentFrame.getElementsByClassName('img');

            for(var i = 0 ; i < imgs.length ; i ++)
            {
                (function(img){
                    img.addEventListener('click',function(){ 
                    var name = "~" + img.getElementsByClassName('desc')[0].innerText;
                    inputDCCon(name);
                    });
                })(imgs[i]);
            }

            new Clipboard('.btn');

            contentFrame.removeChild(contentFrame.getElementsByClassName('loading')[0]);
        } catch (e) {
            alert("Unknown error occured while parsing DCCon JSON.");
            console.log(e);
        }
    }
    function inputDCCon(name) {
        tcf.addTextToChatInput(name + ' ');
    }
    function resetSearch() {
        $('#dcconsearch').val('');
        $('#dcconsearch').trigger("keyup");
    }

    
    var onLoadDcconContentFrame = function() {
        initChatInject();
        funzpicker.controlFrame.getElementsByClassName('btn btn-default')[0].onclick = resetSearch;
    }


    var funzpicker = new tcf.picker(
        'funzinnu_dccon',
        chrome.runtime.getURL('/DCCON_16.png'),
        drawContentFrame,
        drawControlFrame,
        onLoadDcconContentFrame
    );

    funzpicker.setDCCONJSON = function(JSON){
        DCCONJSON = JSON;
    }

    return funzpicker;
})();
