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
}