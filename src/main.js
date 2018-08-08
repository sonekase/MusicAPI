$(document).ready(function() {
  $("form#artistSearch-form").submit(function(event) {
    event.preventDefault();
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


  // $.get(`http://theaudiodb.com/api/v1/json/1/searchalbum.php?s=${artistName}`).then(function(response) {
  //   let albumId = response.album[0].idAlbum;
  //
  //   $.get(`http://theaudiodb.com/api/v1/json/1/track.php?m=${albumId}`).then(function(response) {
  //     trackName = response.track[0].strTrack;
      // $.get(`https://api.lyrics.ovh/v1/${artistName}/${trackName}`).then(function(response){
      //   console.log(response.lyrics);
      //   let lyricArrays = response.lyrics.replace( /\n/g, "." ).split( "." );
      //   lyricArrays.forEach(function(line){
      //     $(".lyrics").append(line + "<br>");
      //   });
      // }).fail(function(error) {
      //   $('.showErrors').text(`There was an error processing your request: ${error.responseText}. Please try again.`);
      // });
  //   }).fail(function(error) {
  //     $('.showErrors').text(`There was an error processing your request: ${error.responseText}. Please try again.`);
  //   });
  // }).fail(function(error) {
  //   $('.showErrors').text(`There was an error processing your request: ${error.responseText}. Please try again.`);
  // });

  // var request = new XMLHttpRequest();
  // request.open('GET', `https://api.lyrics.ovh/v1/Drake/The Motto`);
  //
  // let showLyrics = function(lyric){
  //   console.log(lyric);
  //   let lyricArrays = lyric.replace( /\n/g, "." ).split( "." );
  //   lyricArrays.forEach(function(line){
  //     $(".lyrics").append(line + "<br>");
  //   });
  // }
  //
  // request.onreadystatechange = function () {
  //   if (this.readyState === 4) {
  //     console.log('Status:', this.status);
  //     console.log('Headers:', this.getAllResponseHeaders());
  //     let body = JSON.parse(this.responseText);
  //     showLyrics(body.lyrics);
  //   }
  //
  // };
  //
  // request.send();
});
