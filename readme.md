# COMP 4513 Assignment 1

---

### Node API Using Supabase

## Overview

This assignment is an API created in Node, connected to a database being provisioned by supabase. The database contains information about art, with the following tables: artists, galleries, paintings, paintinggenres, eras, genres, shapes.

## Built with

- Node.js (runtime environment)
- Express (routing)
- Supabase (database)
- Glitch (deployment)

## API Endpoints

| API Endpoint                           | Description                                                                                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| /api/eras                              | Returns all the eras                                                                                                                                 |
| /api/galleries                         | Returns all the galleries                                                                                                                            |
| /api/galleries/**ref**                 | Returns just the specified gallery using the galleryId field                                                                                         |
| /api/galleries/country/**substring**   | Returns the galleries whose galleryCountry (case insensitive) begins with the provided substring                                                     |
| /api/artists                           | Returns all the artists                                                                                                                              |
| /api/artists/**ref**                   | Returns just the specified artist                                                                                                                    |
| /api/artists/search/**substring**      | Returns the artists whose last name (case insensitive) begins with the provided substring                                                            |
| /api/artists/country/**substring**     | Returns the artists whose nationality (case insensitive) begins with the provided substring                                                          |
| /api/paintings                         | Returns all the paintings                                                                                                                            |
| /api/paintings/sort/**title\|year**    | Returns all the paintings, sorted by either title or yearOfWork                                                                                      |
| /api/paintings/**ref**                 | Returns just the specified painting                                                                                                                  |
| /api/paintings/search/**substring**    | Returns the paintings whose title (case insensitive) contains the provided substring                                                                 |
| /api/paintings/years/**start/end**     | Returns the paintings between two years (include the paintings in the provided years), ordered by yearOfWork                                         |
| /api/paintings/galleries/**ref**       | Returns all the paintings in a given gallery                                                                                                         |
| /api/paintings/artists/**ref**         | Returns all the paintings by a given artist                                                                                                          |
| /api/paintings/artists/country/**ref** | Returns all the paintings by artists whose nationality begins with the provided substring                                                            |
| /api/genres                            | Returns all the genres                                                                                                                               |
| /api/genres/**ref**                    | Returns just the specified genre                                                                                                                     |
| /api/genres/painting/**ref**           | Returns the genres used in a given painting, ordered by genreName in ascending order                                                                 |
| /api/paintings/genre/**ref**           | Returns all the paintings for a given genre                                                                                                          |
| /api/paintings/eras/**ref**            | Returns all the paintings for a given era                                                                                                            |
| /api/counts/genres                     | Returns the genre name and the number of paintings for each genre, sorted by the number of paintings (fewest to most)                                |
| /api/counts/artists                    | Returns the artist name (first name space last name) and the number of paintings for each artist, sorted by the number of paintings (most to fewest) |
| /api/counts/topgenres/**ref**          | Returns the genre name and the number of paintings for each genre, sorted by the number of paintings (most to least)                                 |

## Test Links

- https://comp4513-asg1.glitch.me/api/eras
- https://comp4513-asg1.glitch.me/api/galleries
- https://comp4513-asg1.glitch.me/api/galleries/30
- https://comp4513-asg1.glitch.me/api/galleries/Calgary
- https://comp4513-asg1.glitch.me/api/galleries/country/fra
- https://comp4513-asg1.glitch.me/api/artists
- https://comp4513-asg1.glitch.me/api/artists/12
- https://comp4513-asg1.glitch.me/api/artists/1223423
- https://comp4513-asg1.glitch.me/api/artists/search/ma
- https://comp4513-asg1.glitch.me/api/artists/search/mA
- https://comp4513-asg1.glitch.me/api/artists/country/fra
- https://comp4513-asg1.glitch.me/api/paintings
- https://comp4513-asg1.glitch.me/api/paintings/sort/year
- https://comp4513-asg1.glitch.me/api/paintings/63
- https://comp4513-asg1.glitch.me/api/paintings/search/port
- https://comp4513-asg1.glitch.me/api/paintings/search/pORt
- https://comp4513-asg1.glitch.me/api/paintings/search/connolly
- https://comp4513-asg1.glitch.me/api/paintings/years/1800/1850
- https://comp4513-asg1.glitch.me/api/paintings/galleries/5
- https://comp4513-asg1.glitch.me/api/paintings/artist/16
- https://comp4513-asg1.glitch.me/api/paintings/artist/666
- https://comp4513-asg1.glitch.me/api/paintings/artist/country/ital
- https://comp4513-asg1.glitch.me/api/genres
- https://comp4513-asg1.glitch.me/api/genres/76
- https://comp4513-asg1.glitch.me/api/genres/painting/408
- https://comp4513-asg1.glitch.me/api/genres/painting/jsdfhg
- https://comp4513-asg1.glitch.me/api/paintings/genre/78
- https://comp4513-asg1.glitch.me/api/paintings/era/2
- https://comp4513-asg1.glitch.me/api/counts/genres
- https://comp4513-asg1.glitch.me/api/counts/artists
- https://comp4513-asg1.glitch.me/api/counts/topgenres/20
- https://comp4513-asg1.glitch.me/api/counts/topgenres/2034958
> Note: For /api/paintings/artist/country/ital, I followed the Example API Route, using the singular artist instead of the plural artists specified in the instructions.