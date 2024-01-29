import { useEffect, useState } from "react"
const API_BASE = 'http://localhost:5000'


function App() {

  const [toDos, setToDos] = useState()
  const [addPopUpActive, setAddPopUpActive] = useState(false)
  const [updatePopUpActive, setUpdatePopUpActive] = useState(false)
  const [updateTodoId, setActiveTodoIdToUpdate] = useState('')
  const [updateTodoContent, setActiveTodoContentToUpdate] = useState('')
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE}/ToDos`);
      const data = await response.json();
      setToDos(data.body.toDos);
    } catch (e) {
      console.error('Error in fetching to do data:', e);
    }
  };

  const deleteToDo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/ToDos/Delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toDoId: id }),
      });
      const data = await response.json();
      console.log('Todo update response::', data);
      setToDos(toDos.filter(todo => todo._id !== data.body._id));
    } catch (e) {
      console.error('Error in deleting to do:', e);
    }
  }

  const updateToDo = async (id, key, value) => {
    try {
      const response = await fetch(`${API_BASE}/ToDos/Update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toDoId: id, updateKey: key, updateValue: value }),
      });
      const data = await response.json();
      console.log('Todo delete response::', data);
      setUpdatePopUpActive(false);
      setToDos(toDos.map(todo => {
        if (todo._id === data.body._id) {
          return { ...todo, [key]: value }
        }
        return todo
      }));
      setActiveTodoIdToUpdate('')
      setActiveTodoContentToUpdate('')

    } catch (e) {
      console.error('Error in deleting to do:', e);
    }
  }

  const createTodo = async () => {
    try {
      const response = await fetch(`${API_BASE}/ToDos/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newTodo })
      })
      const data = await response.json();
      console.log('Todo create response::', data);

      setAddPopUpActive(false);
      setToDos([...toDos, data.body]);
      setNewTodo('');
    } catch (e) {
      console.error('Error in creating to do:', e);
    }
  }

  const prepUpdate = (id, content) => {
    setUpdatePopUpActive(true);
    setActiveTodoIdToUpdate(id);
    setActiveTodoContentToUpdate(content);
  }

  return (
    <>
      <div className="App">
        <h1>My To Do List</h1>
        <h4>Let me break it!</h4>
        <div className="todos" id={(addPopUpActive || updatePopUpActive) ? 'lighten_bg' : ''}>
          {toDos?.map(todo => (
            <div className={`todo ${todo.completed ? ' is_complete' : ''}`} key={todo._id}>
              <div className="checkbox" onClick={() => { updateToDo(todo._id, 'completed', !todo.completed) }}></div>
              <div className="text">{todo.content}</div>
              <div className="buttons">
                <div className="update" onClick={() => prepUpdate(todo._id, todo.content)}>🖌</div>
                <div className="delete" onClick={() => deleteToDo(todo._id)}>🗑</div>
              </div>
            </div>
          ))}
        </div>

        <div className="show_pop_up" onClick={() => { setAddPopUpActive(true) }}>
          +
        </div>

        {updatePopUpActive && (
          <div className="pop_up_box">
            <div className="close_pop_up" onClick={() => { setUpdatePopUpActive(false) }}>X</div>
            <input type="text" onChange={(e) => setActiveTodoContentToUpdate(e.target.value)} value={updateTodoContent}/>
            <div className="create_button" onClick={() => updateToDo(updateTodoId, 'content', updateTodoContent)}>Update</div>
          </div>
        )}

        {addPopUpActive && (
          <div className="pop_up_box">
            <div className="close_pop_up" onClick={() => { setAddPopUpActive(false) }}>X</div>
            <input type="text" onChange={(e) => setNewTodo(e.target.value)} />
            <div className="create_button" onClick={() => createTodo()}>Create</div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
