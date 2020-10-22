let parseDcconData = function(type, dcconJSON){
    let dcconData = [];

    dcconJSON = dcconJSON['dccons'];

    dcconData = dcconJSON.map(dccon => {
        return {
            name : dccon.keywords.concat(dccon.tags),
            src : dccon.path || dccon.uri
        }
    })

    return dcconData;
}