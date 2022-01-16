const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = new mongoose.Schema({
  name: String
});
const listsSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listsSchema);

app.get("/", (req, res) => {
  Item.find({}, (err, items) => {
    res.render("home", {
      listTitle: date.getDate(),
      itemsList: items
    });
  });
});

app.post("/", (req, res) => {
  const newItem = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: newItem
  });

  if(listName === date.getDate()) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === date.getDate()) {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if(err) {
        console.log(err);
      } else {
        console.log("Selected Item deleted successfully!");
        res.redirect("/")
      }
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, (err, foundList) => {
      if(!err) {
        res.redirect("/" + listName);
      }
    });
  }

});

app.get("/newList", (req, res) => {
  res.render("newList");
});

app.post("/newList", (req, res) => {
  const listName = _.capitalize(req.body.listName);
  res.redirect("/" + listName);
});
app.get("/:customList", (req, res) => {
  const customListName = req.params.customList;
  List.findOne({
    name: customListName
  }, (err, foundList) => {
    if(err) {
      console.log(err);
    } else {
      if(foundList) {
        res.render("home", {
          listTitle: foundList.name,
          itemsList: foundList.items
        });
      } else {
        const list = new List({
          name: customListName,
        });
        list.save();
        res.redirect("/" + customListName);
      }
    }
  });
});


app.listen(3000, () => console.log("Server started on port 3000"));