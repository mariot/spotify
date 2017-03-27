angular.module('musicServices', [])

.factory('Music', function($http) {
  urlOfSearch = 'data/search.json?';
  urlOfArtist = 'data/artist.json?';
  urlOfAlbums = 'data/albums.json?';

  urlOfSearch = 'https://api.spotify.com/v1/search?&type=artist,album&offset=0&limit=5&query=';
  urlOfArtist = 'https://api.spotify.com/v1/artists/';
  urlOfAlbums = '/albums?offset=0&limit=20&album_type=album';

  var db_search = new PouchDB('spotify_search', {skip_setup: true});

  return {
    search: function(keyword) {
      return $http({
        method: 'GET',
        url: urlOfSearch + keyword
      });
    },
    searchNext: function(url) {
      return $http({
        method: 'GET',
        url: url
      });
    },
    getArtist: function(id) {
      return $http({
        method: 'GET',
        url: urlOfArtist + id
      });
    },
    getAlbums: function(artistId) {
      return $http({
        method: 'GET',
        url: urlOfArtist + artistId + urlOfAlbums
      });
    },
    saveLastData: function(key, data) {
      var lastresults;
      db_search.get(key).then(function(result) {
        lastresults = {
            _id: result._id,
            data: data,
            _rev: result._rev
        };

        db_search.put(lastresults, function callback(err, result) {
            if (!err) {
                console.log(result);
            } else {
                console.log(err);
            }
        });
      })
      .catch(function (err) {
        console.log(err);
        lastresults = {
            _id: key,
            data: data
        };

        db_search.put(lastresults, function callback(err, result) {
            if (!err) {
                console.log(result);
            } else {
                console.log(err);
            }
        });
      });
    },
    loadLastData: function(key) {
      return db_search.get(key);
    }
  };
});
