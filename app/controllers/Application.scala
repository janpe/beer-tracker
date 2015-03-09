package controllers

import models.Beer

import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.functional.syntax._

import java.io._

object Application extends Controller {
    
    implicit val beerWrites = new Writes[Beer] {
        def writes(beer: Beer) = Json.obj(
            "id" -> beer.id,
            "name" -> beer.name,
            "beer_type" -> beer.beer_type,
            "brewery" -> beer.brewery,
            "abv" -> beer.abv,
            "hops" -> beer.hops,
            "country" -> beer.country,
            "rating" -> beer.rating,
            "todo" -> beer.todo,
            "image" -> beer.image
        )
    }
    
    implicit val beerReads: Reads[Beer] = (
        (JsPath \ "id").readNullable[Int] and
        (JsPath \ "name").readNullable[String] and
        (JsPath \ "beer_type").readNullable[String] and
        (JsPath \ "brewery").readNullable[String] and
        (JsPath \ "abv").readNullable[Double] and
        (JsPath \ "hops").readNullable[String] and
        (JsPath \ "country").readNullable[String] and
        (JsPath \ "rating").readNullable[Int] and
        (JsPath \ "todo").readNullable[Boolean] and
        (JsPath \ "image").readNullable[String]
    )(Beer.apply _)
    
    // Try getting beers from json, throw exception if it fails
    try {
        val jsonList = Json.parse(scala.io.Source.fromFile("beers.json").mkString)
        jsonList.validate[List[Beer]] match {
            case s: JsSuccess[List[Beer]] => {
                Beer.list = s.get
            }
            case e: JsError => {
                Ok("Error")
            }
        }
    } catch {
        case ex: Exception => println(ex.getMessage)
    }

    def index = Action {
        Ok(views.html.index())
    }
    
    // Json list of the beers for GET request
    def listBeers(id: Int) = Action {
        // Get a single beer if id is greater than 0. In routing default route gets id: -1. 
        if(id > 0) {
            if(Beer.list.find(beer => beer.id.get == id) != None) {
                val json = Json.toJson(Beer.list.find(beer => beer.id.get == id).get)
                Ok(json)
            } else {
                BadRequest(Json.obj("success" -> false, "error" -> "No beer with id: ".concat(id.toString)))
            }
        } else {
            val json = Json.toJson(Beer.list)
            Ok(json)
        }
    }
    
    // Save a new beer from POST request
    def saveBeer = Action(BodyParsers.parse.json) { request =>
        val beerResult = Json.fromJson[Beer](request.body)
        beerResult.fold(
            errors => {
                BadRequest(Json.obj("success" ->false, "errors" -> JsError.toFlatJson(errors)))
            },
            beer => {
                val validation = Beer.validateBeer(beer)
                if(!validation.isEmpty) {
                    BadRequest(Json.obj("success" -> false, "errors" -> Json.toJson(validation)))
                } else {
                    val saveBeer = Beer(
                        Beer.generateId,
                        beer.name,
                        beer.beer_type,
                        beer.brewery,
                        beer.abv,
                        beer.hops,
                        beer.country,
                        beer.rating,
                        beer.todo,
                        beer.image
                    )
                    Beer.save(saveBeer)
                    printToFile(new File("beers.json")) { p =>
                        p.print(Json.toJson(Beer.list));
                    }
                    Ok(Json.obj("success" ->true, "beer" -> saveBeer))
                }
            }
        )
    }
    
    // Update a beer from PUT request
    def updateBeer(id: Int) = Action(BodyParsers.parse.json) { request =>
        if(Beer.list.find(beer => beer.id.get == id) != None) {
            val oldValues = Beer.list.find(beer => beer.id.get == id).get
            val updateBeerResult = Json.fromJson(request.body)
            updateBeerResult.fold(
                errors => {
                    BadRequest(Json.obj("success" ->false, "errors" -> JsError.toFlatJson(errors)))
                },
                beer => {
                    val validation = Beer.validateBeer(beer)
                    if(!validation.isEmpty) {
                        BadRequest(Json.obj("success" -> false, "errors" -> Json.toJson(validation)))
                    } else {
                        val updateBeer = Beer(
                            oldValues.id,
                            if (beer.name != None) beer.name else oldValues.name,
                            if (beer.beer_type != None) beer.beer_type else oldValues.beer_type,
                            if (beer.brewery != None) beer.brewery else oldValues.brewery,
                            if (beer.abv != None) beer.abv else oldValues.abv,
                            if (beer.hops != None) beer.hops else oldValues.hops,
                            if (beer.country != None) beer.country else oldValues.country,
                            if (beer.rating != None) beer.rating else oldValues.rating,
                            if (beer.todo != None) beer.todo else oldValues.todo,
                            if (beer.image != None) beer.image else oldValues.image
                        )
                        val updatedList = Beer.list.updated(Beer.list.indexOf(Beer.list.find(beer => beer.id.get == id).get), updateBeer)
                        Beer.list = updatedList
                        printToFile(new File("beers.json")) { p =>
                            p.print(Json.toJson(Beer.list));
                        }
                        Ok(Json.obj("success" ->true, "updated" -> updateBeer))
                    }
                }
            )
        } else {
            BadRequest(Json.obj("success" -> false, "error" -> "No beer with id: ".concat(id.toString)))
        }
    }
    
    // Delete beer from DELETE request
    def deleteBeer(id: Int) = Action {
        if(Beer.list.find(beer => beer.id.get == id) != None) {
            Beer.list = Beer.list.slice(0, Beer.list.indexOf(Beer.list.find(beer => beer.id.get == id).get)) ::: Beer.list.slice(Beer.list.indexOf(Beer.list.find(beer => beer.id.get == id).get) + 1, Beer.list.length + 1)
            printToFile(new File("beers.json")) { p =>
                p.print(Json.toJson(Beer.list));
            }
            Ok(Json.obj("success" -> true, "beerList" -> Beer.list))
        } else {
            BadRequest(Json.obj("success" -> false, "error" -> "No beer with id: ".concat(id.toString)))
        }
    }
    
    // Store beer data in a Json-file
    def printToFile(f: java.io.File)(op: java.io.PrintWriter => Unit) {
        val p = new java.io.PrintWriter(f)
        try { op(p) } finally { p.close() }
    }
}