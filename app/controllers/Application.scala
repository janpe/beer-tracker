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
            "name" -> beer.name,
            "beer_type" -> beer.beer_type,
            "brewery" -> beer.brewery,
            "abv" -> beer.abv,
            "country" -> beer.country,
            "todo" -> beer.todo
        )
    }
    
    implicit val beerReads: Reads[Beer] = (
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
    
    def listBeers(index: Integer) = Action {
        if(index > 0) {
            if(Beer.list.lift(index) != None) {
                val json = Json.toJson(Beer.list.lift(index).get)
                Ok(json)
            } else {
                Ok(Json.obj("success" -> "false", "error" -> "Index of ".concat(index.toString).concat(" is empty")))
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
                Beer.save(beer)
                printToFile(new File("beers.json")) { p =>
                    p.print(Json.toJson(Beer.list));
                }
                Ok(Json.obj("success" ->"true", "beer" -> beer))  
            }
        )
    }
    
    def updateBeer(index: Integer) = Action(BodyParsers.parse.json) { request =>
        if(Beer.list.lift(index) != None) {
            val newValues = Beer.list.lift(index).get
            val updateBeerResult = Json.fromJson(request.body)
            Predef.println(updateBeerResult)
            updateBeerResult.fold(
                errors => {
                    BadRequest(Json.obj("success" ->"false", "error" -> "Invalid json"))
                },
                beer => {
                    val updateBeer = Beer(
                        if (beer.name != None) beer.name else newValues.name,
                        if (beer.beer_type != None) beer.beer_type else newValues.beer_type,
                        if (beer.brewery != None) beer.brewery else newValues.brewery,
                        if (beer.abv != None) beer.abv else newValues.abv,
                        if (beer.country != None) beer.country else newValues.country,
                        if (beer.todo != None) beer.todo else newValues.todo
                    )
                    val updatedList = Beer.list.updated(index, updateBeer)
                    Beer.list = updatedList
                    printToFile(new File("beers.json")) { p =>
                        p.print(Json.toJson(Beer.list));
                    }
                    Ok(Json.obj("success" ->"true", "updated" -> updateBeer))  
                }
            )
        } else {
            Ok(Json.obj("success" -> "false", "error" -> "Index of ".concat(index.toString).concat(" is empty")))
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