var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

$(document).ready(function() {
  $("form#artistSearch-form").submit(function(event) {
    event.preventDefault();
    $("#player").hide();
    $(".tracklist").show();
    $(".lyrics").text("");
    $("#title").text("");
    let artistName = $("#artistName").val();
    let albumId, trackName;
    let trackLists = [];
    $(".tracklist").text("");
    $.get(`http://theaudiodb.com/api/v1/json/1/searchalbum.php?s=${artistName}`).then(function(response) {
      response.album.forEach(function(album) {
        albumId = album.idAlbum;
        $.get(`http://theaudiodb.com/api/v1/json/1/track.php?m=${albumId}`).then(function(response) {
          response.track.forEach(function(track) {
            let title = track.strTrack;
            trackLists.push(track.strTrack);
            $(".tracklist").append(`<p class="findLyric">${title}</p>`);
            $(".findLyric").last().click(function() {
              $(".tracklist").hide();
              $.get(`https://api.lyrics.ovh/v1/${artistName}/${title}`).then(function(response){
                $("#title").text(title);
                $("#player").show();
                play();
                let lyricArrays = response.lyrics.replace( /\n/g, "." ).split( "." );
                lyricArrays.forEach(function(line){
                  $(".lyrics").append(line + "<br>");
                });
              }).fail(function(error) {
                $('.showErrors').text(`There was an error processing your request: ${error.responseText}. Please try again.`);
              });
            })
          });
        }).fail(function(error) {
          $('.showErrors').text(`There was an error processing your request: ${error.responseText}. Please try again.`);
        });
      });
    }).fail(function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error.responseText}. Please try again.`);
    });
  });

  let play = function(){

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
      event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
      if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
      }
    }
    function stopVideo() {
      player.stopVideo();
    }
  };

});
