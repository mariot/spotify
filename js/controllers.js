var musicControllers = angular.module('musicControllers', []);

musicControllers.controller('SearchController', function($scope, $timeout, Music) {
  Music.loadLastData('lastquery').then(function (doc) {
    $scope.query = doc.data;
  }).catch(function (err) {
    $scope.query = '';
  });

  Music.loadLastData('lastresults').then(function (doc) {
    $scope.results = doc.data.artists.items.concat(doc.data.albums.items);

    $scope.resultData = doc.data;
    $scope.loadButton = showLoadButton();

    $timeout(function () {}, 0);
  }).catch(function (err) {
    console.log(err);
  });

  $scope.search = function(keyword) {
    Music.search(keyword).then(function (doc) {
      $scope.results = doc.data.artists.items.concat(doc.data.albums.items);

      $scope.resultData = doc.data;
      $scope.loadButton = showLoadButton();

      Music.saveLastData('lastquery', keyword);
      Music.saveLastData('lastresults', doc.data);

    }).catch(function (err) {
      console.log(err);
    });
  }

  $scope.loadMoreData = function() {
    if ($scope.resultData.albums.next) {
      Music.searchNext($scope.resultData.albums.next).then(function (doc) {
        $scope.resultData.albums.items = $scope.resultData.albums.items
          .concat(doc.data.albums.items);
        $scope.results = $scope.results.concat(doc.data.albums.items);
      }).catch(function (err) {
        console.log(err);
      });
    }

    if ($scope.resultData.artists.next) {
      Music.searchNext($scope.resultData.artists.next).then(function (doc) {
        $scope.resultData.artists.items = $scope.resultData.artists.items
          .concat(doc.data.artists.items);
        $scope.results = $scope.results.concat(doc.data.artists.items);
      }).catch(function (err) {
        console.log(err);
      });
    }

    $scope.loadButton = showLoadButton();

    Music.saveLastData('lastresults', $scope.resultData);
  }

  function showLoadButton() {
    if ($scope.resultData.albums.next || $scope.resultData.artists.next) {
      return true;
    }
    return false;
  }
});

musicControllers.controller('ArtistDetailsController', function($scope, $routeParams, Music) {
  Music.getArtist($routeParams.artistId).then(function (doc) {
    $scope.artist = doc.data;
  }).catch(function (err) {
    console.log(err);
  });

  Music.getAlbums($routeParams.artistId).then(function (doc) {
    $scope.albums = doc.data.items;
  }).catch(function (err) {
    console.log(err);
  });
});
