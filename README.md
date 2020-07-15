## Library REST API
Library REST API using Node, Express, MongoDB, Mongoose, Docker Containers.

## How to setup on local machine (Without Docker)
- You must have latest Node.js (13.x) and MongoDB installed on your local machine.
- Edit both `/env/dev.env` and `/env/test.env` files and uncomment MongoDB connection string for running project without Docker. If required, specify access credentials in connection string.
- Execute:
    ```sh
    npm run dev # To run project
    npm run test # To run tests
    ```

## How to setup on local machine (Using Docker)
- You must be having Docker installed and running on your machine. You can download and install it from here: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- Download/Clone this repository:
    ```sh
    git clone git@github.com:aditya43/nodejs-library-rest-api.git
    ```
- Go to project root directory and execute following command:
    ```sh
    docker-compose up
    ```

## API Documentations :rocket:
> Documentations: https://documenter.getpostman.com/view/9919903/T17Q54cG?version=latest

-----------

## Authors API
|Request Type|Endpoint|Description|
|------------|--------|-----------|
|`POST`|`/authors`|Sign-up or create new author account.|
|`GET`|`/authors/me`|Retrieve currently logged in author profile details.|
|`GET`|`/authors/books`|Get books owned by currently logged in author.|
|`GET`|`/authors/:id`|Retrieve author profile details by author id.|
|`POST`|`/authors/login`|Sign-in or login to author account.|
|`PATCH`|`/authors/me`|Update profile data for currently logged in author.|
|`DELETE`|`/authors/me`|Delete currently logged-in author's account.|
|`POST`|`/authors/search`|Search for authors based off their name, age and email.|
|`POST`|`/authors/logout`|Logout currently signed-in author.|
|`POST`|`/authors/logoutAll`|Logout or clear all login sessions for currently logged in author account.|

-----------

## Books API
|Request Type|Endpoint|Description|
|------------|--------|-----------|
|`POST`|`/books`|Create/Add new book.|
|`POST`|`/books/search`|Search for books based off their title, isbn, author id, and releaseDate.|
|`GET`|`/books/me`|Get books owned by currently logged in author.|
|`GET`|`/books/:id`|Retrieve book by book id.|
|`PATCH`|`/books/:id`|Update book details.|
|`DELETE`|`/books/:id`|Delete book by book id.|

-----------

## Test Results
![Test Results](/screens/test-results.jpg)