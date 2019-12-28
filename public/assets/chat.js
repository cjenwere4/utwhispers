var ipUserMap = new Map();
$(document).ready(function(){
  var ip = GetUserIP();
  document.title = "UT Whispers - Say anything you want, how you want, whenever you want, anonymously."; // set title
  var messageBody = document.querySelector('section'); 
  messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight; // keeps scroll bar at the bottom
  $('form').on('submit', function(){ // hit submit
      console.log("ip: " + ip);
      var item = $('form input');
      var d = new Date($.now()); // i mainly this for post that are same content but different times, for the liking
      var datefull = (d.getMonth() + 1) + "/" + d.getDate() + " @ " + d.getHours() + ":";
      if (d.getMinutes() < 10)
        datefull = datefull + "0"+ d.getMinutes();
      else 
        datefull = datefull + d.getMinutes();
      var user;
      if (!(ipUserMap.has(ip))) { // ip hasn't been registered yet.. create one and add it to map
        $.ajax({ //get random name
          type: 'GET',
          url: 'https://randomuser.me/api/?results=34&inc=name,gender,nat&noinfo',
          dataType: 'json',
          success: function(data) {
            var num = Math.floor((Math.random() * 33));
            user =  data["results"][num]["name"].first;
          },
          async: false // i had to make it synchronus, the async was pissing me off, i'm sorry user :(, will fix later
        });
        ipUserMap.set(ip, user); // add to map
        console.log("new user found");
        
      } else {
        user = ipUserMap.get(ip);
        console.log("user was already in map");
      }
      var msgsec = d.getSeconds(); // for post identification?
      var chat = {msg: item.val(), likes: '', date: datefull, seconds: msgsec, username: user}; //intially the post will have 0 likes    
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

});

function GetUserIP(){
  var ret_ip;
  $.ajaxSetup({async: false});
  $.get('http://jsonip.com/', function(r){ 
    ret_ip = r.ip; 
  });
  return ret_ip;
}