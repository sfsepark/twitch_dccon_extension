let dccon_picker = (function(){

    const DCCON_CONTENT_FRAME_CLASS = 'dccon_content_frame';
    const DCCON_CONTROL_FRAME_CLASS = 'dccon_control_frame';

    const EMOTICON_FRAME_CLASSNAME = 'dccon-emoticon';

    let contentFrame = null;
    let controlFrame = null;

    let searchInput = null;

    let dcconPickerButtons = null;

    let initialState = true;

    var drawContentFrame = function()
    {
        if(contentFrame == null){
            contentFrame = document.createElement('div');
            contentFrame.classList.add('dccon_frame');
            contentFrame.classList.add(DCCON_CONTENT_FRAME_CLASS );
            contentFrame.innerHTML = `
                <div class="loading">로딩 중...</div>
                <div class="${EMOTICON_FRAME_CLASSNAME}">
                </div>
            `;

        }
        
        return contentFrame;
    }


    let drawControlFrame = function(){
        if(controlFrame == null){
            controlFrame = document.createElement('div');
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

        }

        return controlFrame;

    }

    var initChatInject = function(){
        setTimeout(LoadDCCon, 10);
    }

    var onLoadDcconContentFrame = function() {
        if(initialState == false){
            initChatInject();

            searchInput = controlFrame.getElementsByClassName('dcconsearch')[0];
            searchInput.addEventListener('input', (e) => {
                if(dcconPickerButtons != null){
                    dcconPickerButtons.search(e.target.value);
                }
            });

            controlFrame.getElementsByClassName('btn btn-default')[0].onclick = resetSearch;
        
            initialState = true;
        }
    }

    let dcconPickerOnClick = function(name){
        tcf.addTextToChatInput(name + ' ');
    }

    let resetSearch = function() {
        searchInput.value = '';
    }


    let LoadDCCon = function(){
        try {
            dcconPickerButtons = new DcconPickerButtons(dccondata, dcconPickerOnClick);
            let emoticon_frame = contentFrame.getElementsByClassName(EMOTICON_FRAME_CLASSNAME)[0];
            emoticon_frame.appendChild(dcconPickerButtons.frame);

            contentFrame.removeChild(contentFrame.getElementsByClassName('loading')[0]);
        } catch (e) {
            alert("Unknown error occured while parsing DCCon JSON.");
            console.log(e);
        }
    }

    let dccon_picker = new tcf.picker(
        'dccon',
        chrome.runtime.getURL('/DCCON_16.png'),
        drawContentFrame,
        drawControlFrame,
        onLoadDcconContentFrame
    );

    let dccondata = {dccon : []};

    dccon_picker.init = function(type, dcconJSON){
        contentFrame = null;
        controlFrame = null;

        searchInput = null;
        dcconPickerButtons = null;
        initialState = false;

        dccondata.dccon = parseDcconData(type, dcconJSON);

    }

    return dccon_picker;
})();