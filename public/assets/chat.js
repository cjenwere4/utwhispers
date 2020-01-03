$(document).ready(function(){
  document.title = "UT Whispers - Say anything you want, how you want, whenever you want, anonymously."; // set title
  $(".pages").hide();
  var messageBody = document.querySelector('section'); 
  messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight; // keeps scroll bar at the bottom
  $('form').on('submit', function(){ // hit submit
      var item = $('form input');
      var d = new Date($.now()); // i mainly this for post that are same content but different times, for the liking
      var datefull = (d.getMonth() + 1) + "/" + d.getDate() + " @ " + d.getHours() + ":";
      if (d.getMinutes() < 10)
        datefull = datefull + "0"+ d.getMinutes();
      else 
        datefull = datefull + d.getMinutes();
      var msgsec = d.getSeconds(); // for post identification?
      var chat = {msg: item.val(), likes: '', date: datefull, seconds: msgsec, replies: []}; //intially the post will have 0 likes    
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
  $('.liked').on('click', function(){ // hit like    
    var data = $(this).next().next().next().next('input').val(); // get value of likes
    var msgdata = $(this).next().next().next().next().next('input').val(); //gets the message that was selected
    var datedata = $(this).next().next().next().next().next().next('input').val(); // get the date val
    $(this).toggleClass('clicked');
    $(this).off("click") // Disable further clicks
    var likesno = parseInt(data);
    $(this).next().text("" + (likesno + 1)); // dynamic likes changing.
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
    
    $('.reply').on('click', function(){ // hit reply
      console.log("user just clicked reply button");
      var msgdata = $(this).next().next().next('input').val(); //gets the message that was selected
      var datedata = $(this).next().next().next().next('input').val(); // get the date val
      var msg = {msg: msgdata, date: datedata};
      console.log("message replied: ", msg);
      
      // hide contents
      $('section, #main, #top, footer').hide();
      $(".pages").fadeIn(400); // show reply 
      
      $(".pages").on("click", function(e) {        
        if (!$(e.target) // get the clicked element
            .hasClass("usernameInput") // check if any of them have the usernameInput class and return the opposite with the !
        ) {
          $(".pages").fadeOut(400); // fadeOut if they don't contain the class name.
          $("section, #main, #top, footer").show();
        } 
      });
      
      $('input').bind("keypress.key13", function(e) {
        if (e.which === 13) { // capture enter
          var input = $('input').val();
          if (input !== "") {
            var chat = {msg: msgdata, date: datedata, reply: input};
            $.ajax({
              type: 'POST',
              url: '/',
              data: chat,
              success: function(data){
                console.log("Success. Reply submitted", chat);
              }
            });
          } else
              console.log("Empty output detected.");
          $(".pages").fadeOut(400); // remove reply box
          $('section, #main, #top, footer').show();
          
          $('input').unbind("keypress.key13"); // unbind enter so that we won't have multple request sent
          // clears the input 
          $('input:text').focus(
            function(){
                $(this).val('');
            });
        }
      });
        
    });
    $('.bubble.sender.first.animate-bottom').on('click', function(e){ // hit bubble to reveal replys
      if (!$(e.target) // get the clicked element, make sure it's not the reply button
        .hasClass("reply") // check if any of them have the usernameInput class and return the opposite with the !
      ) {
        console.log("bubble clicked.");
        var message = $(this).find('input.hiddentag').val(); // gets the message
        var replydate = $(this).find('input.hiddendatetag').val(); // gets the date
        var chat = {msg: message, date: replydate};
        console.log(chat);
        window.location.replace("/reply?msg=${" + message + "}&date=${" + replydate + "}"); // redirect to reply page 
      } 
    });
    $('.bubble.recipient.first.animate-bottom').on('click', function(e){ // hit bubble to reveal replys
      if (!$(e.target) // get the clicked element, make sure it's not the reply button
        .hasClass("reply") // check if any of them have the usernameInput class and return the opposite with the !
      ) {
        console.log("bubble clicked.");
        var message = $(this).find('input.hiddentag').val(); // gets the message
        var replydate = $(this).find('input.hiddendatetag').val(); // gets the date
        var chat = {msg: message, date: replydate};
        console.log(chat);
        window.location.replace("/reply?msg=${" + message + "}&date=${" + replydate + "}"); // redirect to reply page 
      }
    });
});