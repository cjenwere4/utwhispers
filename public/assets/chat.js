$(document).ready(function(){
  document.title = "UT Whispers - Say anything you want, how you want, whenever you want, anonymously."; // set title
  $('section').hide(); // hide section for loading
  $('#loadingmask').fadeOut(750, function(){ 
      $(this).remove(); 
      $('section').show(); // show section after loading
  });
  $('form').on('submit', function(){ // hit submit
      var item = $('form input');
      var d = new Date($.now()); // i mainly this for post that are same content but different times, for the liking
      var datefull = (d.getMonth() + 1) + "/" + d.getDate() + " @ " + d.getHours() + ":";
      if (d.getMinutes() < 10)
        datefull = datefull + "0"+ d.getMinutes();
      else 
        datefull = datefull + d.getMinutes();
      var chat = {msg: item.val(), likes: '', date: datefull}; //intially the post will have 0 likes    
      console.log("chat", chat);
      $.ajax({
        type: 'POST',
        url: '/',
        data: chat,
        success: function(data){ //do something with the data via front-end framework, so we can update in reall time
          console.log("Success. Chat submitted", chat);
          location.reload();
        }
      });
      return false;

  });
  $('i').on('click', function(){ // hit like    
    var data = $(this).next().next('input').val(); // get value of likes
    var msgdata = $(this).next().next().next('input').val(); //gets the message that was selected
    var datedata = $(this).next().next().next().next('input').val(); // get the date val
    $(this).toggleClass('clicked');
    $(this).off("click") // Disable further clicks
    var likesno = parseInt(data);
    $(this).next().text("" + (likesno+1)); // dynamic likes changing.
    var likedmsg = {msg: msgdata, likes: '-1', date: datedata}; //dictates a message was liked so find it in database and update it
    $.ajax({ //do something with the data via front-end framework, so we can update in reall time
      type: 'GET',
      url: '/',
      success: function(err){
        $.ajax({
          type: 'POST',
          url: '/',
          data: likedmsg,
          success: function(data){
            //do something with the data via front-end framework, so we can update in reall time
            console.log("Success. Like submitted");
          }
        });
        return false;        
        console.log('success!'); 
      }
    });
      return false;

    });

});
  