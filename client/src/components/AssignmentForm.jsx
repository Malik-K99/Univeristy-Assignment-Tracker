import {useState} from "react";

function AssignmentForm({onAssignmentAdded}) {
    const [title, setTitle] = useState("");
    const [module, setModule] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if(!title.trim()) {
            setError("Please enter an assignment title");
            return;
        }

        if(!module.trim()) {
            setError("Please enter an module title");
            return;
        }

        if(!dueDate) {
            setError("Please enter a due  date");
            return;
        }

        try{
            const response = await fetch(
                "http://localhost:3000/api/assignments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        title: title.trim(),
                        module: module.trim(),
                        dueDate: dueDate
                    })
                }
            );
            
            const data = await response.json();

            if(!response.ok)
            {
                setError(data.message || "Failed to create assignment.");
                return;
            }

            onAssignmentAdded(data);
            setTitle("");
            setModule("");
            setDueDate("");
        }
        catch(error)
        {
            setError("Could not connect to server.");
        }
        
    }

    return(
        <form onSubmit={handleSubmit}>
            <h2>Add Assignment</h2>

            <input type="text"
            placeholder="Assignment title"
            value={title}
            onChange={event => setTitle(event.target.value)}
            />

            <input type="text"
            placeholder="Module"
            value={module}
            onChange={event => setModule(event.target.value)}
            />

            <input type="date"
            value={dueDate}
            onChange={event => setDueDate(event.target.value)}
            />

            {error && (
                <p>{error}</p>
            )}

            <button type="submit">
                Add Assignment
            </button>
        </form>
    );
}

export default AssignmentForm;