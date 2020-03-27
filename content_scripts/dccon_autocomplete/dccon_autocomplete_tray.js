let dcconAutoCompleteTray = (function(){

    // dccon Auto Complete Tray 정의 

    let dcconAutoCompleteTray = {};

    const NC_CHAT_INPUT_TRAY_CLASSNAME = 'nc-simplebar-content';
    const NC_CHAT_INPUT_TRAY__FLOATING_ON = 'nc-chat-input-tray__floating';
    const NC_CHAT_INPUT_TRAY__FLOATING_OFF = 'nc-chat-input-tray__off';

    const SCROLL_AREA_CLASSNAME = 'simplebar-scroll-content';

    let trayHTML = `
        <div data-test-selector="chat-input-tray" class="tw-align-items-start tw-flex tw-flex-row tw-pd-0">
            <div class="tw-flex-grow-1 tw-pd-0">
                <div>
                    <div class="tw-pd-t-05 tw-pd-x-05 tw-relative">
                        <div data-test-selector="autocomplete-matches-container" class="autocomplete-match-list tw-flex tw-flex-column tw-overflow-hidden">
                            <div class="scrollable-area scrollable-area--suppress-scroll-x" data-test-selector="scrollable-area-wrapper" data-simplebar="init" style="max-height: 722px;">
                                <div class="simplebar-track vertical" style="visibility: hidden;">
                                    <div class="simplebar-scrollbar">
                                    </div>
                                </div>
                                <div class="simplebar-track horizontal" style="visibility: hidden;">
                                    <div class="simplebar-scrollbar">
                                    </div>
                                </div>
                                <div class="${SCROLL_AREA_CLASSNAME}" style="padding-right: 17px; margin-bottom: -34px;">
                                    <div class="simplebar-content" style="padding-bottom: 17px; margin-right: -17px;">
                                        <div class="${NC_CHAT_INPUT_TRAY_CLASSNAME}">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    let ncChatInputTrayDOM = document.createElement('div');
    ncChatInputTrayDOM.className = NC_CHAT_INPUT_TRAY__FLOATING_OFF;
    ncChatInputTrayDOM.innerHTML = trayHTML;

    let ncTrayContentFrameDOM = ncChatInputTrayDOM.getElementsByClassName(NC_CHAT_INPUT_TRAY_CLASSNAME)[0];
    let ncTrayScrollContentDOM = ncChatInputTrayDOM.getElementsByClassName(SCROLL_AREA_CLASSNAME)[0];


    dcconAutoCompleteTray.DOM = ncChatInputTrayDOM;

    //dcconAutoCompleteItem 들을 관리하기 위한 메서드 정의

    let dcconAutoCompleteItems = [];
    let selectedDCCON = 0;

    let getIndexFromItemDOM = (autoCompleteItemDOM) => {
        let searchIndex = autoCompleteItemDOM.id.split(NC_AUTO_COMPLETE_ITEM_PREFIX) ;

        if(searchIndex.length > 0){
            return parseInt(autoCompleteItemDOM.id.split(NC_AUTO_COMPLETE_ITEM_PREFIX)[1]);
        }
        else{
            return -1;
        }
    }

    let selectItemIndex = (index) => {
        selectedDCCON = index;

        dcconAutoCompleteItems.forEach((item,index) => {
            if(index != selectedDCCON){
                item.turnOff();
            }
            else{
                item.turnOn();
            }
        })

        //ncTrayScrollContentDOM 의 스크롤 탑 위치를 조작하여 화면밖에 표시되었으면 강제로 위치 변경
    }

    //이벤트 리스너 정의

    dcconAutoCompleteTray.DOM.addEventListener('mouseover', (e) => {
        let closestElement = e.target.closest('.' + NC_AUTO_COMPLETE_ITEM_CLASSNAME);

        if(closestElement != null){
            let hoverIndex = getIndexFromItemDOM(closestElement);

            selectedDCCON = hoverIndex;

            if(hoverIndex != -1  && hoverIndex != NaN){
                selectItemIndex(selectedDCCON);
            }
        }
    })

    dcconAutoCompleteTray.DOM.addEventListener('click', (e) => {
        let closestElement = e.target.closest('.' + NC_AUTO_COMPLETE_ITEM_CLASSNAME);

        if(closestElement != null){
            
        }
    })



    // dcconAutoCompleteTray 의 interface 정의

    dcconAutoCompleteTray.turnOff = () => {
        ncChatInputTrayDOM.className = NC_CHAT_INPUT_TRAY__FLOATING_OFF;
    }
    /*
        parameter : data 
        [
            {src : ~~~, name : ~~~},
            ...
        ]
    */
    dcconAutoCompleteTray.turnOn = (data) => {

        ncTrayContentFrameDOM.innerHTML = '';

        selectedDCCON = 0;

        if(data.length > 0){
            dcconAutoCompleteItems = data.map((v,i) => new AutoCompleteItem({src : v.src , name : v.name, index : i}));

            dcconAutoCompleteItems.forEach(item => {
                let DOM = item.DOM;
                ncTrayContentFrameDOM.appendChild( DOM );
            })

            selectItemIndex(selectedDCCON);
        }
        else{
            ncTrayContentFrameDOM.innerText = '해당하는 디시콘이 없습니다.'
        }
        
        ncChatInputTrayDOM.className = NC_CHAT_INPUT_TRAY__FLOATING_ON;
    }

    //direction > 0 : down, direction <= 0 : up
    dcconAutoCompleteTray.selectNext = (direction) => {
        if(dcconAutoCompleteItems.length > 0){
            if(direction > 0){
                selectedDCCON = selectedDCCON + 1;
                if(selectedDCCON >= dcconAutoCompleteItems.length){
                    selectedDCCON = 0;
                }
            }
            else{
                selectedDCCON = selectedDCCON - 1;
                if(selectedDCCON < 0){
                    selectedDCCON = dcconAutoCompleteItems.length - 1;
                }
            }

            selectItemIndex(selectedDCCON);
        }
    }


    dcconAutoCompleteTray.getSelectedDCCON = () => {
        if(dcconAutoCompleteItems.length > 0)
            return dcconAutoCompleteItems[selectedDCCON].name;
        else 
            return '';
    }
    

    return dcconAutoCompleteTray;
})()