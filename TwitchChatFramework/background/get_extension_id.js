chrome.runtime.onMessage.addListener(function(request, sender, callback){
    if(request.type == 'get_extension_id'){
        chrome.management.getSelf(function(result){
            callback({data:true, extension_id : result.id});

            return true;
        })
    }

    return true;
});