beerService = (function () {
    
    var findById = function (id) {
        var beer = null;
        for (var i = 0; i < beers.length; i++) {
            if (beers[i].id == id) {
                beer = beers[i];
                break;
            }
        }
        return beer;
    },

    findByName = function (searchKey) {
        var results = beers.filter(function (element) {
            return element.name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        return results;
    },
    
    beers = [];
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "/beers", false );
    xmlHttp.send( null );
    var beersJson = JSON.parse(xmlHttp.responseText);
    for(i in beersJson) {
        beers.push(beersJson[i]);
    }

    // The public API
    return {
        findById: findById,
        findByName: findByName
    };

}());