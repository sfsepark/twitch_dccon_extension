var channelProduct = (function(){

    var channelCache = new lru(20);
    var client_id = 'irgj4khs9whj1xx3vw4sdv7fdjp10f';

    function getChannelProduct(channel_name, callback){
        var url = 'https://api.twitch.tv/api/channels/' + channel_name + '/product';
        var xhttp = new XMLHttpRequest();

        xhttp.onload = function() {
            var product = JSON.parse(xhttp.responseText);
            channelCache.set(channel_name,product);
            callback(product);
        };
        xhttp.onerror = function() {
            callback({err : 'xhttp error'});
        };
        xhttp.open('GET', url, true);
        xhttp.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
        xhttp.setRequestHeader('Client-ID', client_id);
        xhttp.send(null);
        return true;
    }    

    return {
        get : function(channelName,callback){
            if(channelCache.contains(channelName)){
                callback(channelCache.get(channelName));
            }
            else{
                getChannelProduct(channelName,callback);
            }
        }
    }
})();