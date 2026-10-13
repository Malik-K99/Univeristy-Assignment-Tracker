import{useEffect, useState} from "react";
import AssignmentCard from "./components/AssignmentCard";
import AssignmentForm from "./components/AssignmentForm";
import Dashboard from "./components/Dashboard";

function App() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/assignments")
        .then(response => response.json())
        .then(data => {
          console.log("DATA FROM SERVER:", data);
          setAssignments(data);
        })
        .catch(error => {
          console.error("FETCH ERROR:", error);
         });

  },[]);

  async function deleteAssignment(id) {
    await fetch(
      `http://localhost:3000/api/assignments/${id}`,
      {
        method: "DELETE"
      }
    );

    setAssignments(previous =>
      previous.filter(assignment => assignment.id !== id)
    );
  }

  async function toggleComplete(assignment) {
    const response = await fetch(
      `http://localhost:3000/api/assignments/${assignment.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: !assignment.completed
        })
      }
    );

    const updatedAssignment = await response.json();

    setAssignments(previous =>
      previous.map(item =>
        item.id === updatedAssignment.id ? updatedAssignment : item
      )
    );
  }

  return(
     <div className="app">
            <header className="app-header">
                <div className="container">
                    <h1>University Assignment Tracker</h1>
                    <p>
                        Keep track of your university
                        assignments and deadlines.
                    </p>
                </div>
            </header>

            <main className="container">
                <Dashboard
                    assignments={assignments}
                />

                <div className="content-grid">
                    <AssignmentForm
                        onAssignmentAdded={newAssignment => {
                            setAssignments(previous => [
                                ...previous,
                                newAssignment
                            ]);
                        }}
                    />

                    <section className="assignments-section">
                        <div className="section-heading">
                            <h2>Your Assignments</h2>
                            <p>
                                {assignments.length} assignment
                                {assignments.length !== 1
                                    ? "s"
                                    : ""}
                            </p>
                        </div>

                        {assignments.length === 0 ? (
                            <div className="empty-state">
                                <h3>No assignments yet</h3>
                                <p>
                                    Add your first assignment
                                    using the form.
                                </p>
                            </div>
                        ) : (
                            assignments.map(assignment => (
                                <AssignmentCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    onDelete={deleteAssignment}
                                    onComplete={
                                        toggleComplete
                                    }
                                />
                            ))
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}






export default App