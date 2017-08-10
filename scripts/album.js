

 var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
       +'   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
       +'   <td class="song-item-title">' + songName + '</td>'
       +'   <td class="song-item-duration">' + songLength + '</td>'
       +'</tr>'
       ;

       var $row = $(template);

      var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
          var currentlyPlayingTab = getSongNumberCell(currentlyPlayingSongNumber);
          currentlyPlayingTab.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
          $(this).html(pauseButtonTemplate);
          setSong(songNumber);
          updatePlayerBarSong();
        }

        else if (currentlyPlayingSongNumber === songNumber) {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          $('.main-controls .next').html(playerBarNextButton);
          currentlyPlayingSongNumber = null;
          currentSongFromAlbum = null;
        }
      };

      var onHover = function(event){
         var songNumberTab = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberTab.attr('data-song-number'));

         if (songNumber !== currentlyPlayingSongNumber) {
           songNumberTab.html(playButtonTemplate);
         }
       };

       var offHover = function(event) {
         var songNumberTab = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberTab.attr('data-song-number'));

         if (songNumber !== currentlyPlayingSongNumber) {
           songNumberTab.html(songNumber)
         }
       };

       $row.find('.song-item-number').click(clickHandler);

       $row.hover(onHover, offHover);

       return $row;
 };

 var updatePlayerBarSong = function() {

     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
     $('.main-controls .play-pause').html(playerBarPauseButton);
 };


var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
      currentSongIndex = 0;
    }
    var lastSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);

    updatePlayerBarSong();

    var $nextSongNumberTab = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberTab = getSongNumberCell(lastSongNumber);

    $nextSongNumberTab.html(pauseButtonTemplate);
    $lastSongNumberTab.html(lastSongNumber);
};

var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }
  var lastSongNumber = currentlyPlayingSongNumber;

  setSong(currentSongIndex + 1);

  updatePlayerBarSong();

$('.main-controls .play-pause').html(playerBarPauseButton);

var $previousSongNumberTab = getSongNumberCell(currentlyPlayingSongNumber);
var $lastSongNumberTab = getSongNumberCell(lastSongNumber);

  $previousSongNumberTab.html(pauseButtonTemplate);
  $lastSongNumberTab.html(lastSongNumber);
};

var setSong = function(songNumber) {
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};


 var $albumTitle = $('.album-view-title');
 var $albumArtist = $('.album-view-artist');
 var $albumReleaseInfo = $('.album-view-release-info');
 var $albumImage = $('.album-cover-art');
 var $albumSongList = $('.album-view-song-list');


 var setCurrentAlbum = function(album) {
   currentAlbum = album;
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
    }
 };

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var playerBarNextButton = '<span class ="ion-skip-forward"></span>';

var currentSongFromAlbum = null;
var currentlyPlayingSongNumber = null;
var currentAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
        $nextButton.click(nextSong);


});
var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albums = [albumPicasso, albumMarconi, albumDjango];
    var index = 1;
    albumImage.addEventListener('click', function(event) {
            setCurrentAlbum(albums[index]);
            index++;
            if (index == albums.length) {
              index = 0;
            }
      });
//test
