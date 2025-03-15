//importing the required packages 'express' is used to create server and 'cors' is used to connect frontend and backend

require("dotenv").config();
const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DATABASE_URL, {}).then(() =>
  app.listen(PORT, () => {
    console.log(`server is listening http://localhost:${PORT}`);
  })
);

const todoSchema = new mongoose.Schema({
  id: { type: Date, default: Date.now },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const todo = mongoose.model("todo", todoSchema);

//post us used for adding new todo to database
app.post("/add-task", async (req, res) => {
  const newTask = new todo(req.body);
  console.log(newTask);
  try {
    await newTask.save();
    res
      .status(201)
      .json({ message: "Task added successfully!", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "internel server error" });
  }
});

//delete is used to delete a todo from array
app.delete("/del-task/:id", async (req, res) => {
  try{const deletedItem = await todo.findOneAndDelete(
    {id: req.params.id});
    if(deletedItem) return res.status(200).json({message:'deleted successfully', task:deletedItem})
      else return res.status(400).json({message:"item not found"})
  }catch(err){res.status(500).json({message:err})}
});

//put is used to update some specific todo from array api
app.put("/update-task/:id", async (req, res) => {
  try {
    if (!req.body.title || req.body.title.trim() === "") {
      return res.status(400).json({ message: "Title empty" });
    }
    const updatedTitle = await todo.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedTitle) {
      res.status(200).json({ message: "update successful", updatedTitle });
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//get function provides the data to the frontEnd
app.get("/tasks", async (req, res) => {
  const todos = await todo.find();
  res.json(todos);
});
//the server namely app is listening
