beerService = (function () {
    
    var apiPath = '/beers';
    var beers = [];
    
    // Find item by id, used for single item view and editing
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

    // Find item by name, used for search functionality
    findByName = function (searchKey) {
        var results = beers.filter(function (element) {
            return element.name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        return results;
    },
        
    // Find item by brewery name, used for search functionality
    findByBrewery = function (searchKey) {
        var results = beers.filter(function (element) {
            return element.brewery.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        return results;
    },
    
    // Combined to find items by name and brewery name, used by the search bar
    search = function(searchKey) {
        var results = [];
        var nameResults = findByName(searchKey);
        var breweryResults = findByBrewery(searchKey);
        results = nameResults;
        for(var i in breweryResults){
           var duplicate = false;
           for (var j in nameResults)
               if (breweryResults[i].name == nameResults[j].name) {
                   duplicate = true;
                   break;
               }
           if(!duplicate) results.push(breweryResults[i])
        }
        return results;
    },
        
    // Get all items for listing
    getBeers = function() {
        getItems();
        return beers;
    },
        
    // GET all items from from the API
    getItems = function() {
        beers = [];
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", apiPath, false );
        xmlHttp.send( null );
        var beersJson = JSON.parse(xmlHttp.responseText);
        for(i in beersJson) {
            beers.push(beersJson[i]);
        }
    },
      
    // POST new item 
    postItem = function(postBeer, callback) {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", apiPath, true);
        xmlHttp.setRequestHeader("Content-type", "application/json");
        xmlHttp.send(JSON.stringify(postBeer));
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4) {
                callback(JSON.parse(xmlHttp.responseText).beer.id);
                getItems();
            }
        }
    },
    
    // PUT updated item
    putItem = function(putBeer) {
        console.log(putBeer);
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("PUT", apiPath+"/"+putBeer.id, true);
        xmlHttp.setRequestHeader("Content-type", "application/json");
        xmlHttp.send(JSON.stringify(putBeer));
        getItems();
    },
        
    // DELETE item
    deleteItem = function(deleteId) {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("DELETE", apiPath+"/"+deleteId, true);
        xmlHttp.send();
        getItems();
    };
    
    getItems();

    return {
        findById: findById,
        findByName: findByName,
        findByBrewery: findByBrewery,
        search: search,
        getBeers: getBeers,
        postItem: postItem,
        putItem: putItem,
        deleteItem: deleteItem
    };

}());