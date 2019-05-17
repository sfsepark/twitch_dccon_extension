var tcfBackground = (function() {

    //--------------------- MESSAGE LISTENER -----------------------------------

    /*
        content script -> background -> content script
        user_info 
        emote_list
    */

    chrome.runtime.onMessage.addListener(
        function(request, sender, callback)
        {
            if(request.type == 'user_info'){
                userInfo.get(callback);
            }
            else if(request.type == 'emote_list'){
                emoteInfo.get(callback);
            }

            return true;
        }
    );

    //-------------------------- WHEN COOKIE CHANGED OR REFRESH --------------------------------

    var cookieChangeListeners = [];
    var refreshFunctions = [];

    function refresh(tcfonly){
        userInfo.refresh();
        emoteInfo.refresh();
        
        if(tcfonly !== true){
            refreshFunctions.forEach(function(refreshFunction){
                refreshFunction();
            }) ;     
        }
    }

    chrome.runtime.onMessage.addListener(function(request, sender, callback){
        if(request.type == 'refresh'){
            refresh();
            return true;
        }
    })

    /*
    chrome.cookies.onChanged.addListener(function(changeInfo){
        if(changeInfo.cookie.domain == '.twitch.tv'){
            if(changeInfo.cookie.name == 'twilight-user' && changeInfo.cause == 'explicit')
            {
                refresh();
            }
        }
    });
    */

    //-------------------------- CHANNEL EMOTES ------------------------------

    chrome.runtime.onMessage.addListener(
        function(request, sender, callback)
        {
            if(request.type == 'channel_product')
            {
                channelProduct.get(request.channel_name , callback);
                return true;
            }
        }
    );

    //-------------------------------------------------------------------------

    var tcfStatusPromise = new Promise(function(resolve){

        var tcfStatus = undefined;

        chrome.storage.local.get(['tcf_status'], function(result) {
            if(result.tcf_status === true  || result.tcf_status === false){
                tcfStatus = result.tcf_status;
            }
            else{
                tcfStatus = true;
                chrome.storage.local.set({tcf_status: true}, function() {});
            }

            resolve(tcfStatus);
        });
    })


    chrome.runtime.onMessage.addListener(
        function(request, sender, callback)
        {
            if(request.type == 'tcf_status_change')
            {
                tcfStatusPromise = new Promise(function(resolve){

                    if(request.data === true || request.data === false){

                        resolve(request.data);

                        chrome.storage.local.set({tcf_status: request.data}, callback);
                    }
                })
            }
            else if(request.type == 'tcf_status_get'){
                tcfStatusPromise.then(function(result){
                    callback({'data' : result});
                }).catch(function(err){callback({'error' : err});});
            }

            return true;
        }
    );


    //-------------------------------------------------------------------------

    return {
        registerCookieListener : function(callback){
            cookieChangeListeners.push(callback);
        },
        registerRefresh : function(callback){
            refreshFunctions.push(callback);
        },
        refresh : refresh,
        statusPromise : function(){return tcfStatusPromise;}
    }
    
})();

//------------------------
