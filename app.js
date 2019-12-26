var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose'); 
var urlencodedParser = bodyparser.urlencoded({extended: true});
mongoose.connect('mongodb+srv://cjenwere:021399@utwhispers-j9ky1.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
var chatSchema = new mongoose.Schema({
    msg: String,
    likes: Number,
    date: String
});
var chats = mongoose.model('Chat', chatSchema);
mongoose.set('useFindAndModify', false);
// set up an express app, gives us all functions of express
var app = express();
app.listen(42069);
app.set('view engine', 'ejs');
app.use(express.static('./public'));
console.log("Listening to port 42069");
app.get('/', function(req, res){ // express has extended these fucntion
    console.log("app.get");
    setInterval(deleteDailyChats, 86400000, chats); // all chats will delete after 24 hours
    // deleteDailyChats(chats); //delete chats manually
    chats.find({}, function(err, data) {
        if (err) {
            console.log("error rendering");
            throw err // crash
        }
        res.render('mainview', {chats: data});
    })
});
app.post('/', urlencodedParser, function(req, res){
    var numlikes;
    console.log("app.post");
    if (req.body.msg.length <= 0)
        console.log("you didn't input a message");
    else if (req.body.likes == '') { // user just submited a post
        req.body.likes = 0;
        var newChat = chats(req.body).save(function(err, data){ // save new data
            if (err) {
                console.log("error when submiting post");
                throw err;
            }
            res.json(data);
            console.log("saved");
        
        });
    } else if (req.body.likes == -1) { // user just liked a post
        console.log("user just liked a post.");
        chats.find({msg: req.body.msg, date: req.body.date}, function(err, data) { // find liked post
            if (err) throw err; // crash
            // find current likes
            numlikes = data[0].likes; // leave the [0] for now
            numlikes++;
            data[0].likes = numlikes; // leave the [0] for now
            chats.findOneAndUpdate( // update current likes
                { "msg": req.body.msg , "date": req.body.date}, {"$set": { "likes": numlikes }},
                function(err,doc) {                    
                    if (err) {
                        console.log("error when updating");
                        throw err;
                    }                    
                }
            );
            res.json(data);
        }); 
    }
});

function deleteDailyChats(chats) {
    console.log("Chats just deleted.");
    chats.deleteMany({}, function (err) {
        console.log('error');
        if (err) throw err
    }); 
    
}