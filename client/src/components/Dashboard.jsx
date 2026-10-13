function Dashboard({ assignments }) {
    const total = assignments.length;

    const completed = assignments.filter(
        assignment => assignment.completed
    ).length;

    const pending = total - completed;

    const upcomingAssignments = assignments
        .filter(assignment => !assignment.completed)
        .sort(
            (a, b) =>
                new Date(a.dueDate) - new Date(b.dueDate)
        );

    const nextAssignment = upcomingAssignments[0];

    function formatDate(dateString) {
        const date = new Date(dateString + "T00:00:00");

        return date.toLocaleDateString("en-IE", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    return (
        <section className="dashboard">
            <div className="stat-card">
                <h2>{total}</h2>
                <p>Total Assignments</p>
            </div>

            <div className="stat-card">
                <h2>{pending}</h2>
                <p>Pending</p>
            </div>

            <div className="stat-card">
                <h2>{completed}</h2>
                <p>Completed</p>
            </div>

            <div className="next-deadline">
                <p>Next Deadline</p>

                {nextAssignment ? (
                    <>
                        <h3>{nextAssignment.title}</h3>
                        <p>{nextAssignment.module}</p>
                        <p>{formatDate(nextAssignment.dueDate)}</p>
                    </>
                ) : (
                    <h3>No pending assignments</h3>
                )}
            </div>
        </section>
    );
}

export default Dashboard;