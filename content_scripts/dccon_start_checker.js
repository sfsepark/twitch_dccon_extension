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
                            
                            var observeFunctions = [];
                            var pickers = [];
                            var onLoad = [];
                            var onReset = [];
                                                        
                            observeFunctions.push(dcconObserver(roomStreamer,DCCONJSON));

                            if(loginStatus == true){

                                if(isMaster){
                                    pickers.push(emote_picker);                                    
                                    emote_picker.init(roomStreamer);                                    
                                    onReset.push(emote_picker.reset);
                                }

                                if(roomStreamer == 'funzinnu')
                                {
                                    funzinnu_dccon_picker.setDCCONJSON(DCCONJSON);
                                    pickers.push(funzinnu_dccon_picker);
                                }
                            }

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
    