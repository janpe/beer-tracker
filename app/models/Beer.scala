package models

case class Beer(id: Option[Int], name: Option[String] = None, beer_type: Option[String] = None, brewery: Option[String] = None, abv: Option[Double] = None, hops: Option[String], country: Option[String] = None, rating: Option[Int], todo: Option[Boolean] = None)

object Beer {
    var list: List[Beer] = {
        List()
    }
    
    def save(beer: Beer) = {
        list = list ::: List(beer)
    }
    
    def generateId = {
        if(list.length > 0) {
            Some(list.sortBy(beer => (beer.id)).last.id.get + 1)
        } else {
            Some(1)
        }
    }
    
    // Validate beer values before saving
    def validateBeer(beer: Beer) = {
        var errors: Map[String, String] = Map()
        if(beer.name.isEmpty) {
            errors += ("name" -> "Beer name cannot be empty")
        }
        if(beer.abv != None && (beer.abv.get > 100 || beer.abv.get < 0)) {
            errors += ("abv" -> "Beer abv must be between 0-100")
        }
        if(beer.rating != None && (beer.rating.get > 100 || beer.rating.get < 1)) {
            errors += ("rating" -> "Beer rating must be between 1-100")
        }
        errors
    }
}