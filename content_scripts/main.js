var timerPromise = new Promise(function(resolve, reject){
    setTimeout(function(){
        resolve({result : false , data : "PORTAL PROJECT LOAD TIME OUT"});
    }
    ,10000);
});

var bgPromises = new Promise(function(resolve, reject){
    Promise.all([emote_picker.promise]).then(function(values){
        resolve({result : true , data : values});
    }).catch(function(err){
        reject(err);
    });
});

Promise.race([timerPromise, bgPromises]).then(function(value){

    if(value.result == true){
        tcf.addStartChecker(useDcconStartChecker(value.data[0]));
        tcf.start();
    }
    else{
        console.log(value.data);
    }

}).catch(function(err){
    console.log(err);
});

