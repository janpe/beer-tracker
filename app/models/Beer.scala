package models

case class Beer(id: Option[Int], name: Option[String] = None, beer_type: Option[String] = None, brewery: Option[String] = None, abv: Option[Double] = None, country: Option[String] = None, todo: Option[Boolean] = None)

object Beer {
    var list: List[Beer] = {
        List()
    }
    
    def save(beer: Beer) = {
        list = list ::: List(beer)
    }
    
    def generateId = {
        Some(list.sortBy(beer => (beer.id)).last.id.get + 1)
    }
}