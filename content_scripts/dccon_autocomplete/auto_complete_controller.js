

let getCurrentTokenInfo = () => {
    const tokenizerRegex = /\s+|\S+/g;

    const curChatText = tcf.chatText;
    let lastToken =  tokenizerRegex.exec(curChatText);

    let index = 0;
    
    while(lastToken){
        if(tokenizerRegex.lastIndex >= tcf.chatCursor && tcf.chatCursor > index){
            return {
                str : lastToken[0],
                index : index
            }
        }

        index = tokenizerRegex.lastIndex;
        lastToken =  tokenizerRegex.exec(curChatText);
    }

    return null;

}

const CHAT_INPUT_CONTAINER__OPEN_CLASS = "nc-chat-input-container__open";
const CHAT_INPUT_CONTAINER__INPUT_WRAPPER_CLASS = 'nc-chat-input-container__input-wrapper';

const constructAutoCompleteController = (type, DCCONJSON) => {

    const ARROW_DOWN_DIR = 1;
    const ARROW_UP_DIR = -1;

    const dcconRegex = /^~(\S+)$/;

    let dccondata = parseDcconData(type, DCCONJSON);
    let chatInputContainerInterval = -1;

    let chatInputContainer = null;

    let filterDcconData = (str) => {
        return dccondata.filter(v =>{
            let filtered = false;
    
            v.name.forEach(name => {
                if(name.search(str) != -1)
                    filtered = true;
            })
            
            return filtered;
        } );
    }

    let state = false;

    let turnOn = function(filteredDcconData){
        if(chatInputContainerInterval == -1)
        {
            chatInputContainerInterval = setInterval(() => {
                chatInputContainer.classList.add(CHAT_INPUT_CONTAINER__OPEN_CLASS);
                chatInputContainer.firstChild.classList.add(CHAT_INPUT_CONTAINER__INPUT_WRAPPER_CLASS );
            }, 50)
        }

        dcconAutoCompleteTray.turnOn(filteredDcconData);

        state = true;
        
    }
    let turnOff = function(){
        state = false;

        dcconAutoCompleteTray.turnOff();

        if(chatInputContainerInterval != -1)
            clearInterval(chatInputContainerInterval);

        chatInputContainerInterval = -1;

        setTimeout(() => {

            chatInputContainer.classList.remove(CHAT_INPUT_CONTAINER__OPEN_CLASS);
            chatInputContainer.firstChild.classList.remove(CHAT_INPUT_CONTAINER__INPUT_WRAPPER_CLASS );
        }, 100);
    }

    let prevDcconStr = '';

    let arrowEventListener =  function(e){

        if(state == true){
            if(e.keyCode == 38){
                dcconAutoCompleteTray.selectNext(ARROW_UP_DIR);
            }
            else if(e.keyCode == 40){
                dcconAutoCompleteTray.selectNext(ARROW_DOWN_DIR);
            }
        }
        
    }

    let selectEventListener = function(e){
        if(e.keyCode == 9){
            e.preventDefault();

            if(state == true){
                
            }
        }
    }

    let detectChatEventListener = function(e) {
        if(e.keyCode != 9 &&
            e.target == tcf.chatTarget.chat_input){
            let tokenInfo = getCurrentTokenInfo();
            if(tokenInfo){
                let dcconMatch = tokenInfo.str.match(dcconRegex);
            
                if(dcconMatch && dcconMatch.length > 1){
                    const curDcconStr = dcconMatch[1];
                    if(prevDcconStr != curDcconStr){

                        const filteredDcconData = filterDcconData(curDcconStr);
                        turnOn(filteredDcconData)  ;     

                        prevDcconStr = curDcconStr;
                    }
                }
                else{
                    turnOff();
                    prevDcconStr = '';
                }
            }
            else{
                turnOff();
                prevDcconStr = '';
            }
        }
    }

    let clickOutsideEventListener = function(e){
        if(state == true){
            if(e.target.closest(NC_CHAT_INPUT_TRAY__FLOATING_ON) == null){
                turnOff();
            }
        }
    }

    return  {
        onLoad : function(){

            chatInputContainer= tcf.chatTarget.chat_input.closest('.tw-relative').closest('.tw-block');
        
            if(chatInputContainer != null){
                chatInputContainer.parentElement.appendChild(dcconAutoCompleteTray.DOM);

                tcf.chatTarget.chat_input.addEventListener('keydown', arrowEventListener);
                tcf.chatTarget.chat_input.addEventListener('keydown', selectEventListener);
                tcf.chatTarget.chat_input.addEventListener('keyup', detectChatEventListener);      
                
                document.getElementById('root').addEventListener('click', clickOutsideEventListener);

            }
        },
        onReset : function(){
            document.getElementById('root').removeEventListener('click',clickOutsideEventListener);
        }
    }
}