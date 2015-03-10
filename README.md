# beer-tracker

REST API & Web UI project for tracking your favourite beers as well as adding interesting 'to-do' ones that you haven't tried yet.

Backend written in Scala using Play Framework. play-sass plugin used for compiling sass into stylesheets.

Frontend built with React. Bourbon Neat used for some responsive styles.

This is my first time writing Scala and I didn't have any previous experience on React either so feel free to give me feedback on the code!

## Running the app

To run the app install Play Framework through Typesafe Activator ([https://www.playframework.com/documentation/2.3.x/Installing](https://www.playframework.com/documentation/2.3.x/Installing)) and run it with the command.

```
activator run
```

The app can now be used in the browser by navigating to http://localhost:9000/

## Beer object properties

* id: automatically generated, Integer
* name: beer name, String, required
* beer_type: beer type, String
* brewery: brewery name, String
* abv: alcohol by volume, Double, validated to be 0-100
* hops: hops used in the beer, String
* country: beer's country of origin, String
* rating: rating 1-100, Integer, validated to be 1-100
* todo: the beer is on your to-do list, Boolean
* image: image of the beer, String (base64 encoded image)

## Using the REST API

### GET

Simply do a GET request to /beers

```
curl --include --request GET http://localhost:9000/beers
```

### POST

Do a POST request to /beers with header "Content-type: application/json" and Json data containing at least the required properties

```
curl --include --request POST --header "Content-type: application/json" --data '{"name": "My favourite beer", "rating": 100}' http://localhost:9000/beers
```

### PUT

Do a PUT request to /beers/:id with header "Content-type: application/json" and Json data containing the desired updates to the object

```
curl --include --request PUT --header "Content-type: application/json" --data '{"name": "My least favourite beer", "rating": 10}' http://localhost:9000/beers/1
```

### DELETE

Simply do a DELETE request to /beers/:id

```
curl --include --request DELETE http://localhost:9000/beers/1
```

## License

The MIT License (MIT)

Copyright (c) 2015 Jani Kinnunen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
