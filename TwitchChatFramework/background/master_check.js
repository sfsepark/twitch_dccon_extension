var tcf_status_check_str = 'tcf_status_check';

chrome.runtime.onMessage.addListener(function(request, sender, callback){
    if(request.type == 'master_check'){
        chrome.management.getSelf(function(result){
            var myId = result.id;
            if(result.id == 'nljojmgmnidbehhocgkbeejchcmkpgki' || result.name == 'Twitch DCCON extension'){

                chrome.management.getAll(function(result){

                    var checked = false;

                    for(var extensionInfo of result){
                        if(extensionInfo.id != myId && extensionInfo.name == '트위티콘 차원문'){
                            chrome.runtime.sendMessage(extensionInfo.id, {type: tcf_status_check_str},
                                function(response) {
                                    if(response != null)
                                    {
                                        if(response.data == false){
                                            callback({data : true, isMaster : true});
                                        }
                                        else{
                                            callback({data : true, isMaster : false});
                                        }
                                    }
                                    else{
                                        callback({data : true, isMaster : true});
                                    }

                                    return true;
                                });
                            
                            checked = true;
                            break;
                        }
                    }

                    if(checked == false){
                        callback({data : true, isMaster : true});
                    }


                    return true;
                });

            }
            else{
                callback({data : true});
            }

            return true;
        })
    }

    return true;
})


chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        if(request.type == tcf_status_check_str){
            tcfBackground.statusPromise().then(function(result){
                sendResponse({'data' : result});
            }).catch(function(err){
                sendResponse({'data' : false});
            });
        }        

        return true;
    
    }
);