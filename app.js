import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {
    fileURLToPath
} from 'url';
import {
    dirname
} from 'path';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Connecting to Database
const url = "mongodb+srv://rishivasista:Password@tododatabase.uwhy1jm.mongodb.net/?retryWrites=true&w=majority";
const local_url = "mongodb://localhost:27017/todolistDB"
mongoose.connect(url);

// Database Schema
const itemsSchema = new mongoose.Schema({
    name: String,
});

const listsSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

// Creating a model
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listsSchema);

// Default Items
const ins1 = new Item({
    name: "Welcome to your ToDoList"
});
const ins2 = new Item({
    name: "Click on '+' to add new items"
});
const ins3 = new Item({
    name: "<-- Click here to delete the item"
});

// Temporary Array to store the items
const itemArr = [ins1, ins2, ins3];



app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"))
app.set("view engine", "ejs");

let workListItems = [];
let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options);

app.get("/", (req, res) => {
    
    Item.find().then((items) => {
        if (items.length === 0) {
            // Inserting items from itemArr into database
            Item.insertMany(itemArr).then(console.log("Items inserted!!")).catch((err) => console.log(err));
            res.redirect("/");
        }
        else{
            res.render("list", {
                listTitle: day,
                listitems: items
            });
        }
    }).catch((err) => {
        console.log(err)
    });


});

app.post("/", (req, res) => {
    let new_item = req.body.todoitem;
        let item = new Item({name: new_item});
    Item.insertMany(item).then((console.log("Items inserted!!"))).catch((err)=>console.log(err));
    res.redirect("/");
    
});

app.post("/delete", (req, res)=>{
    let item_selected = req.body.checked_item;
    // console.log(item_selected);
    Item.findByIdAndDelete(item_selected).then(console.log("Item Deleted!!")).catch((err)=>console.log(err));
    res.redirect("/");
});


app.get("/:route",(req, res)=>{
    let listName = req.params.route;
    
    
    List.find({name: listName}).then((list)=>{
        if(list.length === 0){
            const list = new List({
                name: listName,
                items: itemArr
            });
            list.save();
            res.redirect("/"+listName);
        }
        else{
            res.render("list", {listTitle: list[0].name, listitems: list[0].items});
        }
    })
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(process.env.PORT || 3000, () => console.log("Server started successfully!!"));