# NatureFinder

![](wireframes/results.png)

The NatureFinder app allows users to find wildlife in their area. Users can search for a location (worldwide), and then the ap will display animals recently sighted in that area, and users can view information such as the peak month for animal sightings in the past year. Users can also make a profile and then save animals as a favorite for future reference.

See it live: [http://naturefinder.herokuapp.com/](http://naturefinder.herokuapp.com/)

## 1. Project Planning

### MVP
As a basic MVP, it was decided from the information able to be pulled from the API that a basic user interaction would have these steps:

1. *Search by zipcode or location.* This would then be translated into a latitude and longitude range.
2. *Show animals in that location.* The GBIF API would be called using the range from the previous step, and resulting occurences would need to be mapped into an array of unique animals based on species.
3. *Click on an animal to view its information.* For the animal clicked upon by the user, a species call would be made to the GBIF API using the unique species key for that animal. Next, another occurence call would be made to list recent occurences of that animal. The user would be able to see the number of occurences over the past year, with the peak month highlighted.
4. *Allow the user to save the animal for later.* If the user is logged in, there would be an option on the page for the user to save the animal as a favorite. Its information would then be stored in a database and retrieved when they view their profile page. 

**Stretch Goals**

* Allow users to make a journal entry if they saw an animal
* Show a feed of recent journal entries on the homepage 
* Use the Unplugg API to predict future sightings using the timeseries forecasting models

### Finding APIs

The ideas for the project began with finding APIs to use. This project initially uses 2:

* **GBIF (Global Biodiversity Information Facility)** -  API and database for wildlife occurences. 
[Website](https://www.gbif.org/developer/summary)

* **Mapbox** - API for time series forecasting. [Website](https://docs.mapbox.com/api/search/)

The idea was to create an app that shows animals in a particular area and show past data over . Users can use this information to determine when is a best time to see a particular animal in that area. 

#### API Calls

To ensure that the pertinent information could be pulled from the api, several sample calls were made. It was found that the GBIF could search for occurences based on a logitude and latitude range. Since the intention was for a user to input a zipcode or location name in the search function, another API would need to be used to change that location into a latitude and longitude range. [Mapbox](https://docs.mapbox.com/api/search/) has forward geocoding API which would be used to translate a place name into a latitude and longitude. A range would be tacked onto this before calling the GBIF API. Finally, a species call would be made to the GBIF API to get information about a particular species.


### Database

Two tables were planned for the database: users and animals. These two tables would have a many to many (M:M) relationship, with many animals having many users. The database was a PostGreSQL database populated using the node module Sequelize.

**Table: Users**

* email: string
* name: string
* password: string
* img: string

The password was limited between 8 and 99 characters, name between 1 and 99 characters, and the email could not be null. Node modules passport and bcrypt were used to encrypt the passwords and support user authentication.

**Table: Animals**

* speciesKey: integer
* name: string
* lat: numeric
* long: numeric
* location: string
* img: string

The animals table stored the species key, which was the GBIF species key to be used to call the API for that species. The vernacular name was also stored, and if no name was available, the species was stored as the name. The location was stored, but to make it easier to call the location in the Mapbox API, the latitude and longitude were also stored. Finally, an image of the animal was stored; if there was no image available, instead a placeholder image was used.

**Table: UsersAnimals**

* UserID: integer (foreign key)
* AnimalID: integer (foreign key)


### Routing

The following routes were developed for a RESTful routing system in Express with full CRUD capabilities.

_**GET**_

**/** - show the homepage

**/auth/signup** - show a form to make a new account

**/auth/login** - show a form to log in

**/auth/logout** - log the user out and redirect to home

**/profile** - show a user's profile

**/profile/edit** - show a form to edit a user's profile

**/results** - show either a list of locations or the animal results for a single location

**/results/:id** - show a single animal

Authorization was utilized so that only relevant get routes could be accessed if a user is logged in. The profile page called on the DB to get information about a user and their favorited animals. The results pages were the most complicated, making multiple calls to the APIs. 



#### Calling the APIs for the Results Page

![](wireframes/showpage.png)

1. *Querying Mapbox.* The Mapbox forward Geocoding API was called to translate user input into a place name. If there are multiple results, the results page lists the locations. Otherwise, Mapbox translate a place name or zipcode into a latitude and longitude.
2. *Searching GBIF Occurences* The latitude and longitude is converted into a ~10 mile range around the given coordinates. This is used to call the GBIF occurence API to find animals sighted in the area. An array of occurences filters each occurence by species key so that the same species does not appear twice, and is instead added to a count of that species. 
3. *Showing an individual result.* When the user clicks on an animal, a form is filled to pass that information to the show page. Namely, the GBIF species key is passed to call the API for occurences of that species in the area. The information from the species call is displayed on the page. The occurence API is again called, and an iterator loops through to store in which month they occured. If the user is logged in, a button pops up allowing them to save the animal. If they have already favorited it, a star appears by the name, along with a button allowing them to remove it from their favorites. 

_**POST**_

**/auth/signup** - create a user in the db

**/auth/login** - use passport to authenticate the user

**/profile/favorites** - add a new animal to the db


_**PUT**_
**/profile/edit** - update a user's profile in the db

_**DELETE**_

**/profile/:key** - delete an animal from the user's favorites by removing the relation in the usersAnimals relational table.


### Site Design

The site was designed to be familiar to visitors of US national parks, and echoes the design of their brochures/maps.

![](wireframes/brochure.jpg)
*Brochure for Olympic National Forest*

![](wireframes/titlepage.png)
*User profile page*

#### User Flow and Wireframes

![](wireframes/user-flow.png)
*Initial User Flow Diagram*

A user flow was mocked up to determine how a new or past user would navigate the sight. Then, several wireframes were developed to determine the layout of some of the more complex webpages, such as the home page. Next, UX students were consulted to critique the user flow and wireframes. Because of this, the link to "Home" at the top was removed, and the logo was made more prominent.

![](wireframes/home.png)
*Wireframe for Homepage*

![](wireframes/profile.png)
*Wireframe for a user profile*

![](wireframes/show-result.png)
*Wireframe to show an animal*


## 2. Technologies Used

**APIs** GBIF, Mapbox

**Node Modules** Mapbox-sdk, Axios, BCrypt, connect-flash, .env, EJS, Express, Express EJS Layouts, Express Sessions, Helmet, Method Override, Morgan, Nodemon, Passport, Sequelize.

### Acknowledgements

Thanks to my instructors, Anna and Sarah, for help debugging, as well as the TAs Gabe and Zara for help using the GBIF API, and thanks to Thinh for letting me borrow her photo.


