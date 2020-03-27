let parseDcconData = function(type, dcconJSON){
    let dcconData = [];

    if(type == 'funzinnu'){
        for(var i = 0 ; i < Object.keys( dcconJSON ).length ; i ++)
        {
            dcconData.push({
                name : [ Object.keys( dcconJSON )[i] ],
                src : dcconJSON[Object.keys( dcconJSON )[i]]
            });
        }
    }
    else{
        dcconJSON = dcconJSON['dccons'];

        dcconData = dcconJSON.map(dccon => {
            return {
                name : dccon.keywords.concat(dccon.tags),
                src : dccon.path
            }
        })
    }

    return dcconData;
}