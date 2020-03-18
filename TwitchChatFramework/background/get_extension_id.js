chrome.runtime.onMessage.addListener(function(request, sender, callback){
    if(request.type == 'get_extension_id'){
        chrome.management.getSelf(function(result){
            let uuid_reg = /[0-9a-zA-Z\-]+/;
            let reg_res =  uuid_reg.exec(result);
            let extension_id = result.id;
            if(reg_res != null){
                extension_id = reg_res[0];
            }
            callback({data:true, extension_id : extension_id});

            return true;
        })
    }

    return true;
});