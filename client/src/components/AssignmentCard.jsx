/*function AssignmentCard({assignment, onDelete, onComplete}){
    return(
        <div className="assignment-card">
            <h2>{assignment.title}</h2>
            <p>Module: {assignment.module}</p>
            <p>Due: {assignment.dueDate}</p>
            <p>
                Statuss: {" "}
                {assignment.completed ? "Completed":"Not Completed"}
            </p>

            <button onClick={() => onComplete(assignment)}>
                {assignment.completed ? "Mark Completed": "Not Complete"}
            </button>

            <button onClick={() => onDelete(assignment)}>
                Delete
            </button>
        </div>
    );

}*/

function AssignmentCard({assignment,onDelete,onComplete}){
    return(
        <div>
            <h2>{assignment.title}</h2>
            <p>Module: {assignment.module}</p>
            <p>Due: {assignment.dueDate}</p>

            <p>
                Status: {" "}
                {assignment.completed ? "Completed" : "Not Completed"}
            </p>

            <button onClick={() => onComplete(assignment)}>
                {assignment.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>

            <button onClick={() => onDelete(assignment.id)}>
                Delete
            </button>
        </div>
    );
}

export default AssignmentCard;








