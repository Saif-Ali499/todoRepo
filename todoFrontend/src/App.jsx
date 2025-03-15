import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [isId, setIsId] = useState("");
  // fetch function which fetches the data from server and helps to display that on frontend
  const fetchTasks = async () => {
    const response = await fetch("http://localhost:4000/tasks");
    const data = await response.json();
    setTasks(data);
    console.log(data);
  };

  //this is add task function which makes a fetch request to the server on given link and then using the post method the task is added to the api at server
  const addTask = async (e) => {
    e.preventDefault();
    if (!task) return;
    await fetch("http://localhost:4000/add-task", {
      method: "POST",
      headers: { "content-type": "application/json" },

      body: JSON.stringify({ title: task }),
    });
    console.log(task);
    setTask("");
    fetchTasks();
  };

  //this is the update function which simply updates the title of task by using id
  const updateTask = async (id) => {
    if (isId !== id) {
      console.log("hello");
      setIsId(id);
      const currentTask = tasks.find((item) => item.id === id);
      setEditTitle(currentTask ? currentTask.title : "");
      return;
    }

    await fetch(`http://localhost:4000/update-task/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    });
    setIsId("");
    setEditTitle("");
    fetchTasks();
  };

  //delete function simply makes request to delete a specific task from api at backend
  const deleteTask = async (id) => {
    await fetch(`http://localhost:4000/del-task/${id}`, {
      method: "DELETE",
    });
    fetchTasks();
  };

  //hook used to render the page when some change is made
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="grid p-10 gap-10 bg-[#2a456e] mt-10 w-[50rem] content-center justify-center">
      <h1 className="text-center text-3xl text-orange-300 my-10">
        Manage Your Todos
      </h1>
      
          <form className="flex" onSubmit={addTask}>
            <input
              className="w-full border border-black/10 rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5 h-15 text-2xl"
              type="text"
              placeholder="enter todo"
              value={task}
              onChange={(e) => {
                setTask(e.target.value);
              }}
            />
            <button
              type="Submit"
              className="rounded-r-lg px-3 py-1 bg-green-600 text-white shrink-0"
              >
              Add
            </button>
          </form>
        
      <ul className="w-full text-3xl grid justify-center mb-10 ">
        {tasks.map((item) => (
          <li
            key={item.id}
            className="w-full flex justify-center h-15 items-center my-2 rounded-l-lg px-3 outline-none bg-[#ccbed7]"
          >
            <input
              type="text"
              className={`w-full h-[42px] outline-none p-3 ${
                isId === item.id ? "border-1" : "border-transparent"
              }`}
              value={isId === item.id ? editTitle : item.title}
              readOnly={isId !== item.id}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <button
              className="w-[5rem] h-[42px] cursor-pointer justify-center items-center shrink-0 disabled:opacity-50"
              onClick={() => updateTask(item.id)}
            >
              {isId === item.id ? "📁" : "✏️"}
            </button>
            <button
              className="w-[5rem] h-[42px] cursor-pointer"
              onClick={() => deleteTask(item.id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
