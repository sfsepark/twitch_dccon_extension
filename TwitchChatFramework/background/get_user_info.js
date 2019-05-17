// In twitch chat framework 

var userInfo = (function(){

    var cookieData = null;
    var initStatus = true;
    var refreshPending = true;
    var refreshResolve , refreshReject ;
    var refreshPromise = new Promise(function(resolve, reject){
        refreshResolve = function(res){
            console.log('user info refresh');
            refreshPending = false;
            resolve(res);
        };
        refreshReject = function(res){
            console.log('user info refresh fail');
            refreshPending = false;
            reject(res);
        };
    });

    function refresh(callback){        

        if(refreshPending == false){
            refreshPromise = new Promise(function(resolve, reject){
                refreshResolve = function(res){
                    console.log('user info refresh');
                    refreshPending = false;
                    resolve(res);
                };
                refreshReject = function(res){
                    console.log('user info refresh fail');
                    refreshPending = false;
                    reject(res);
                };
            });

            refreshPending = true;
        }
        else if(initStatus == false){
            if(typeof(callback) === 'function'){
                refreshPromise.then(function(result){
                    callback(result);
                }).catch(function(err){
                    callback(err);
                });
            }

            return;
        }

        cookieData = null;

        initStatus = false;

        chrome.cookies.get(
            {url:"https://twitch.tv", name: "twilight-user"},
            function(cookie){
                if(cookie != null && cookie.value != null)
                {
                    cookieData = JSON.parse(decodeURIComponent(cookie.value));
                }
                else{
                    cookieData = null;
                }
                
                refreshPending = false;
                refreshResolve(cookieData);
                
                if(typeof(callback) === 'function'){
                    callback(cookieData);
                }
        });

        return true;
    }

    return {
        refresh: refresh,
        get : function(callback){
            refreshPromise.then(function(result){
                callback(result);
            }).catch(function(err){
                callback(err);
            });

            return true;
        }
    }
                

})();