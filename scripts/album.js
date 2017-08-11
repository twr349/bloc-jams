

 var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
       +'   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
       +'   <td class="song-item-title">' + songName + '</td>'
       +'   <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
          currentSoundFile.play();
          updateSeekBarWhileSongsPlays();
          updatePlayerBarSong();
          currentSongVolume();
        }

        else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
              $(this).html(pauseButtonTemplate);
              $('.main-controls .play-pause').html(playerBarPauseButton);
              currentSoundFile.play();
              updateSeekBarWhileSongsPlays();
            }
            else {
              $(this).html(playButtonTemplate);
              $('.main-controls .play-pause').html(playerBarPlayButton);
              currentSoundFile.pause();
            }

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

    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
 };

var filterTimeCode = function (timeInSeconds) {
  var sec = Number.parseFloat(timeInSeconds);
  var milSec = Math.floor(sec * 1000);
  var wholeSec = Math.floor(milSec / 1000);
  var min = Math.floor(wholeSec / 60);
  var roundSec = wholeSec - (min * 60);

  if (roundSec < 10) {
  roundSec = '0' + roundSec;
}
  return min + ":" + roundSec;
};

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
      currentSongIndex = 0;
    }
    var lastSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongsPlays();
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
  currentSoundFile.play();
  updateSeekBarWhileSongsPlays();
  updatePlayerBarSong();

$('.main-controls .play-pause').html(playerBarPauseButton);

var $previousSongNumberTab = getSongNumberCell(currentlyPlayingSongNumber);
var $lastSongNumberTab = getSongNumberCell(lastSongNumber);

  $previousSongNumberTab.html(pauseButtonTemplate);
  $lastSongNumberTab.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function() {

var $currentlyPlayingTab = getSongNumberCell(currentlyPlayingSongNumber);

  if (currentSoundFile.isPaused()) {
    $currentlyPlayingTab.html(pauseButtonTemplate);
    $(this).html(playerBarPauseButton);
    currentSoundFile.play();
    updateSeekBarWhileSongsPlays();

  }
  else {
    $currentlyPlayingTab.html(playButtonTemplate);
    $(this).html(playerBarPlayButton);
    currentSoundFile.pause();
  }

};

var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      formats:[ 'mp3' ],
      preload: true
    });
      setVolume(currentVolume);
};

var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};

var setVolume = function(volume) {
  if (currentSoundFile) {
      currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var currentSongVolume = function() {
  var $volumeFill = $('.volume .fill');
  var $volumeThumb = $('.volume .thumb');
  $volumeFill.width(currentVolume + '%');
  $volumeThumb.css({left: currentVolume + '%'});
};

 var $albumTitle = $('.album-view-title');
 var $albumArtist = $('.album-view-artist');
 var $albumReleaseInfo = $('.album-view-release-info');
 var $albumImage = $('.album-cover-art');
 var $albumSongList = $('.album-view-song-list');
 //var totalTime = $('.duration');

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

var setTotalTimeInPlayerBar = function(totalTime) {
  var $totalSongTime = $('.seek-control .total-time');
  $totalSongTime.text(totalTime);
};

 var setCurrentTimeInPlayerBar = function(currentTime) {
    //var currentTime = this.getTime();
    var $songTime = $('.seek-control .current-time');
    $songTime.text(currentTime);
 };

var updateSeekBarWhileSongsPlays = function() {
  if (currentSoundFile) {
      currentSoundFile.bind('timeupdate', function(event) {
        var currentTime = this.getTime();
        var songTotalTime = this.getDuration();
        var seekBarFillRatio = currentTime / songTotalTime;
        var $seekBar = $('.seek-control .seek-bar');

        updateSeekPercentage($seekBar, seekBarFillRatio);
        setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
      });
  }
};

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
     var offsetXPercent = seekBarFillRatio * 100;

     offsetXPercent = Math.max(0, offsetXPercent);
     offsetXPercent = Math.min(100, offsetXPercent);

     var percentageString = offsetXPercent + '%';
     $seekBar.find('.fill').width(percentageString);
     $seekBar.find('.thumb').css({left: percentageString});
  };

  var setupSeekBars = function() {
      var $seekBars = $('.player-bar .seek-bar');

      $seekBars.click(function(event) {
          var offsetX = event.pageX - $(this).offset().left;
          var barWidth = $(this).width();
          var seekBarFillRatio = offsetX / barWidth;

          if ($(this).parent().attr('class') === 'seek-control') {
              seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio * 100);
            }
          updateSeekPercentage($(this), seekBarFillRatio);
      });

      $seekBars.find('.thumb').mousedown(function(event) {

        var $seekBar = $(this).parent();

        $(document).bind('mousemove.thumb', function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().attr('class') === 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });

        $(document).bind('mouseup.thumb', function () {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
      });
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
var currentSoundFile = null;
var currentVolume = 80;

var $PlayPause = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $PlayPause.click(togglePlayFromPlayerBar);


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
