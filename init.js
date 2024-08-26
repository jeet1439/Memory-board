
//if u need some data to start working u can once run this file in terminal write: npx nodemon init.js
const mongoose = require('mongoose');
const Chat = require("./models/chat.js");
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
let allChats = [
    {
    from: "neha",
    to: "priya", 
    msg: "hello , how r u",
    created_at: new Date()
    },
    {
    from: "jeet",
    to: "priya", 
    msg: "keyse tu gumgunaye...",
    created_at: new Date()
    },    
];
Chat.insertMany(allChats);