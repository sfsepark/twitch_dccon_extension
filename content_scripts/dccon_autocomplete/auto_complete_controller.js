
const constructAutoCompleteController = (type, DCCONJSON) => {

    const ARROW_DOWN_DIR = 1;
    const ARROW_UP_DIR = -1;

    const CHAT_INPUT_CONTAINER__OPEN_CLASS = "nc-chat-input-container__open";
    const CHAT_INPUT_CONTAINER__INPUT_WRAPPER_CLASS = 'nc-chat-input-container__input-wrapper';

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
        chatInputContainerInterval = setInterval(() => {
            chatInputContainer.classList.add(CHAT_INPUT_CONTAINER__OPEN_CLASS);
            chatInputContainer.firstChild.classList.add(CHAT_INPUT_CONTAINER__INPUT_WRAPPER_CLASS );
        }, 50)
    
        dcconAutoCompleteTray.turnOn(filteredDcconData);

        state = true;
        
    }
    let turnOff = function(){
        state = false;

        clearInterval(chatInputContainerInterval);

        chatInputContainer.classList.remove(CHAT_INPUT_CONTAINER__OPEN_CLASS);
        chatInputContainer.firstChild.classList.remove(CHAT_INPUT_CONTAINER__INPUT_WRAPPER_CLASS );

    }

    return  {
        onLoad : function(){

            chatInputContainer= tcf.chatTarget.chat_input.closest('.tw-relative').closest('.tw-block');
        
            if(chatInputContainer != null){
                chatInputContainer.parentElement.appendChild(dcconAutoCompleteTray.DOM);

                tcf.chatTarget.chat_input.addEventListener('keydown', (e) => {
                    if(state == true){
                        if(e.keyCode == 38){
                            dcconAutoCompleteTray.selectNext(ARROW_UP_DIR);
                        }
                        else if(e.keyCode == 40){
                            dcconAutoCompleteTray.selectNext(ARROW_DOWN_DIR);
                        }
                    }
                })

                tcf.chatTarget.chat_input.addEventListener('keydown', (e) => {
                    if(e.target == tcf.chatTarget.chat_input){
                        
                    }
                })
            }
        },
        onReset : function(){

        }
    }
}