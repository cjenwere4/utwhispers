
$(document).ready(function(){
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
              console.log("Success. Redirection executed.");
            }
          });
          return false;        
          console.log('success!'); 
        }
      });
});