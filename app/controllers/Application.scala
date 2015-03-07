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
            "country" -> beer.country,
            "todo" -> beer.todo
        )
    }
    
    implicit val beerReads: Reads[Beer] = (
        (JsPath \ "id").readNullable[Int] and
        (JsPath \ "name").readNullable[String] and
        (JsPath \ "beer_type").readNullable[String] and
        (JsPath \ "brewery").readNullable[String] and
        (JsPath \ "abv").readNullable[Double] and
        (JsPath \ "country").readNullable[String] and
        (JsPath \ "todo").readNullable[Boolean]
    )(Beer.apply _)
    
    val jsonList = Json.parse(scala.io.Source.fromFile("beers.json").mkString)
    
    jsonList.validate[List[Beer]] match {
        case s: JsSuccess[List[Beer]] => {
            Beer.list = s.get
        }
        case e: JsError => {
            Ok("Error")
        }
    }

    def index = Action {
        Ok(views.html.index(Beer.list))
    }
    
    def listBeers(id: Integer) = Action {
        if(id > 0) {
            if(Beer.list.find(beer => beer.id.get == id) != None) {
                val json = Json.toJson(Beer.list.find(beer => beer.id.get == id).get)
                Ok(json)
            } else {
                Ok(Json.obj("success" -> "false", "error" -> "No beer with id: ".concat(id.toString)))
            }
        } else {
            val json = Json.toJson(Beer.list)
            Ok(json)
        }
    }
        
    def saveBeer = Action(BodyParsers.parse.json) { request =>
        val beerResult = Json.fromJson[Beer](request.body)
        beerResult.fold(
            errors => {
                BadRequest(Json.obj("success" ->"false", "message" -> "Invalid json"))
            },
            beer => {
                val saveBeer = Beer(
                    Beer.generateId,
                    beer.name,
                    beer.beer_type,
                    beer.brewery,
                    beer.abv,
                    beer.country,
                    beer.todo
                )
                Beer.save(saveBeer)
                printToFile(new File("beers.json")) { p =>
                    p.print(Json.toJson(Beer.list));
                }
                Ok(Json.obj("success" ->"true", "beer" -> saveBeer))  
            }
        )
    }
    
    def updateBeer(id: Integer) = Action(BodyParsers.parse.json) { request =>
        if(Beer.list.find(beer => beer.id.get == id) != None) {
            val oldValues = Beer.list.find(beer => beer.id.get == id).get
            val updateBeerResult = Json.fromJson(request.body)
            updateBeerResult.fold(
                errors => {
                    BadRequest(Json.obj("success" ->"false", "error" -> "Invalid json"))
                },
                beer => {
                    val updateBeer = Beer(
                        oldValues.id,
                        if (beer.name != None) beer.name else oldValues.name,
                        if (beer.beer_type != None) beer.beer_type else oldValues.beer_type,
                        if (beer.brewery != None) beer.brewery else oldValues.brewery,
                        if (beer.abv != None) beer.abv else oldValues.abv,
                        if (beer.country != None) beer.country else oldValues.country,
                        if (beer.todo != None) beer.todo else oldValues.todo
                    )
                    val updatedList = Beer.list.updated(Beer.list.indexOf(Beer.list.find(beer => beer.id.get == id).get), updateBeer)
                    Beer.list = updatedList
                    printToFile(new File("beers.json")) { p =>
                        p.print(Json.toJson(Beer.list));
                    }
                    Ok(Json.obj("success" ->"true", "updated" -> updateBeer))  
                }
            )
        } else {
            Ok(Json.obj("success" -> "false", "error" -> "No beer with id: ".concat(index.toString)))
        }
    }
    
    def deleteBeer(index: Integer) = Action {
        if(Beer.list.lift(index) != None) {
            Beer.list = Beer.list.drop(index+1)
            printToFile(new File("beers.json")) { p =>
                p.print(Json.toJson(Beer.list));
            }
            Ok(Json.obj("success" -> "true", "beerList" -> Beer.list))
        } else {
            Ok(Json.obj("success" -> "false", "error" -> "Index of ".concat(index.toString).concat(" is empty")))
        }
    }
    
    def printToFile(f: java.io.File)(op: java.io.PrintWriter => Unit) {
        val p = new java.io.PrintWriter(f)
        try { op(p) } finally { p.close() }
    }

}