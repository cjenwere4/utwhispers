var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose'); 
var parser = require('url');
var urlencodedParser = bodyparser.urlencoded({extended: true});

//Below LOC is the real database, use for reference only
mongoose.connect('mongodb+srv://cjenwere:021399@utwhispers-j9ky1.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

// Below LOC is the test database, use this at all times.
// mongoose.connect('mongodb+srv://test:021399af23@cluster0-sv63o.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

var chatSchema = new mongoose.Schema({
    msg: String,
    likes: Number,
    date: String,
    seconds: Number,
    replies: Array
});
var chats = mongoose.model('Chat', chatSchema);
var port = process.env.PORT || 8081;
mongoose.set('useFindAndModify', false);
// set up an express app, gives us all functions of express
var app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.listen(port);
console.log("Listening to port" + port);
app.get('/', function(req, res){ // express has extended these fucntion
    res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict"); // get rid of annoying google message
    console.log("app.get");
    // setInterval(deleteDailyChats, 86400000, chats); // all apporipiate chats will delete after 24 hours
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
    res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict"); // get rid of annoying google message
    var numlikes;
    console.log("app.post");    
    if (req.body.msg !== undefined && req.body.msg.length <= 0)
        console.log("you didn't input a message");
    else if (req.body.likes !== undefined && req.body.likes == '') { // user just submited a post
        req.body.likes = 0;
        var newChat = chats(req.body).save(function(err, data){ // save new data
            if (err) {
                console.log("error when submiting post");
                throw err;
            }
            res.json(data);
            console.log("saved");
        
        });
    } else if (req.body.likes !== undefined && req.body.likes == -1) { // user just liked a post
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
    } else if (req.body.reply !== undefined){
        // console.log("reply logged.");
        // console.log(req.body.date);
        chats.find({msg: req.body.msg, date: req.body.date}, function(err, data) { // find liked post
            if (err) throw err; // crash
            // find current likes            
            var replyarray = data[0].replies; // leave the [0] for now
            replyarray[replyarray.length] = req.body.reply;
            console.log("length of array: " + replyarray.length);
            chats.findOneAndUpdate( // update current likes
                { "msg": req.body.msg , "date": req.body.date}, {"$set": { "replies": replyarray }},
                function(err,doc) {                    
                    if (err) {
                        console.log("error when updating");
                        throw err;
                    }                    
                }
            );
            res.json(data); // ?           
        }); 
        
    }
});
app.get('/reply', function(req, res){
    console.log("reply get requested");
    var obj = parser.parse(req.url, true);
    var parsedmsg = (req.query.msg).substr(2, (req.query.msg).length - 3);
    var parsedate = (req.query.date).substr(2, (req.query.date).length - 3);    
    chats.find({msg: parsedmsg, date: parsedate}, function(err, data) {
        if (err) {
            console.log("error rendering");
            throw err // crash
        }
        console.log('found');
        console.log(data);
        res.render('reply', {chat: data});
    })
})

function deleteDailyChats(chats) {
    var d = new Date();
    var yesterday = d.setDate(d.getDate() - 2);
    var date = new Date(yesterday);
    date = date.toLocaleString();
    date = date.substr(0, 3);
    console.log("48 hours ago date: ", date);
    chats.deleteMany({date: {"$regex": date}}, function(err, data) { // find liked post
        console.log(data);
        if (err) {
            console.log("Error: No chats to delete.");
            throw err;
        }
    });
}