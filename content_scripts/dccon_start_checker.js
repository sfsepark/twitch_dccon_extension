//------------------ get JSON from open-dccon-mapping ------------------------
// open-dccon 매핑에서 스트리머 정보를 확인한 후 , 등록된 스트리머라면 useDcconPromise 함수를 실행한다.

function useDcconStartChecker(loginStatus){

    return function(roomStreamer, isMaster){  
        var streamer = roomStreamer;

        return new Promise(function(resolve, reject){
            chrome.runtime.sendMessage({
                method: 'GET',
                action: 'xhttp',
                url: 'https://open-dccon-selector.update.sh/api/dccon-url?channel_name=' + roomStreamer,
                data: ''
            }, function(responseText) {
                    var JSONURL = JSON.parse(responseText);

                    if(JSONURL['user_id'] != null)
                    {                    
                        if(roomStreamer == 'funzinnu') {
                            JSONURL = 'https://cors-anywhere.herokuapp.com/https://www.funzinnu.com/stream/dccon.js';
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

                            if(roomStreamer === 'funzinnu'){
                                var responseJSON = responseText.replace('dcConsData','')
                                responseJSON = responseJSON.replace('=', '')
                                responseJSON = responseJSON.replace(';', '')
                                DCCONJSON = {"dccons" : JSON.parse(responseJSON).map(
                                    ({name, uri, keywords, tags}) => 
                                    ({
                                        name,
                                        path : uri, 
                                        keywords, 
                                        tags : tags.filter(tag => tag !== '미지정')}
                                    ))
                                }
                            }
                            else{

                                DCCONJSON = JSON.parse(responseText);
                            }
                            
                            var observeFunctions = [];
                            var pickers = [];
                            var onLoad = [];
                            var onReset = [];
                                                        
                            observeFunctions.push(dcconObserver(roomStreamer,DCCONJSON));

                            if(loginStatus == true){

                                dccon_picker.init(roomStreamer, DCCONJSON);
                                pickers.push(dccon_picker);

                            }

                            let dcconAutoCompleteController = constructAutoCompleteController(roomStreamer, DCCONJSON);

                            onLoad.push(dcconAutoCompleteController.onLoad);
                            onReset.push(dcconAutoCompleteController.onReset);

                            var config = new tcf.config(
                                observeFunctions,
                                pickers,
                                onLoad,
                                onReset
                            );

                            resolve(config);
                        });
                    }
                    else{
                        resolve(new tcf.config([],[],[]));
                    }
                }
            );
        });
    
    }
}
    