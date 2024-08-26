const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const Chat = require("./models/chat.js");
const ExpressError = require("./ExpressError.js");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

main()
.then(()=>{
  console.log("connection sucessful with daabase");
})
.catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
// }

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}
//index route to show users
app.get("/chats", async (req, res, next)=>{
  try{
    let chats = await Chat.find();
  // console.log(chats);
  res.render("index.ejs", {chats});
  }
  catch(err){
    next(err);
  }
});

app.get("/chats/new" , (req, res)=>{
    // throw new ExpressError(404, "page not found");
    res.render("new.ejs");
});

//create route
app.post("/chats", async (req, res, next)=>{
  try{
  let {from, to, msg} =  req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date()
  });
  await newChat.save();
  res.redirect("/chats");
  } catch(err){
    next(err);
  }
});

//edit route

// let chat1 = new Chat({
//     from: "neha",
//     to: "priya", 
//     msg: "hello , whatsupp",
//     created_at: new Date()
// });
// chat1.save().then((res)=>{
//     console.log(res);
// })

//edit troute
app.get("/chats/:id/edit", async (req, res, next)=>{
  try{
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", {chat});
  }
  catch(err){
    next(err);
  }
});
//update route
app.put("/chats/:id", async (req, res, next)=>{
  try{
  let { id } = req.params;
  let { msg: newMsg } = req.body;
  let Updatedchat = await Chat.findByIdAndUpdate(
    id, 
    {msg: newMsg},
    {runValidators: true, new: true } 
  );
  console.log(Updatedchat);
  res.redirect("/chats");
}
catch(err){
  next(err);
}
});

//destry route
app.delete("/chats/:id", async (req, res, next)=>{
  try{
  let { id } = req.params;
  let delChat = await Chat.findByIdAndDelete(id);
  console.log(delChat);
  res.redirect("/chats");
  }
  catch(err){
    next(err);
  }
})
app.get("/", (req, res)=>{
    res.send("welcome, visit: `localhost:8080/chats` for exploring");
});
//new show route for learing error handeling:-
//it only work when chat not exit not work on other error , we shpuld implement try catch
app.get("/chats/:id", async (req, res, next) =>{
  let { id } = req.params;
  let chat = await Chat.findById(id);
  if(!chat){
    next(new ExpressError(404, "chat not found"));
  }
  res.render("edit.ejs", { chat });
});

app.use((err, req, res, next) =>{
  let { status=500, message = "some error occured" } = err;
  res.status(status).send(message);
})
app.listen(8080, ()=>{
    console.log("server is listening at the port 8080");
});

