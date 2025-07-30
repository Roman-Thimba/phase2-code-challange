
function Overview({ goals }) {
  const totalGoals = goals.length;
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const completedGoals = goals.filter(g => g.savedAmount >= g.targetAmount).length;
  const today = new Date();

  return (
    <div className="bg-white shadow rounded p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">Overview</h2>
      <p>Total Goals: {totalGoals}</p>
      <p>Total Saved: ${totalSaved}</p>
      <p>Completed Goals: {completedGoals}</p>

      <div className="mt-2 space-y-1">
        {goals.map(goal => {
          const deadline = new Date(goal.deadline);
          const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
          const isOverdue = daysLeft < 0 && goal.savedAmount < goal.targetAmount;
          const isWarning = daysLeft <= 30 && daysLeft >= 0 && goal.savedAmount < goal.targetAmount;

          return (
            <div key={goal.id} className="text-sm">
              <span className="font-bold">{goal.name}:</span> {daysLeft} days left
              {isWarning && <span className="text-yellow-600 font-semibold ml-2">⚠️ Nearing Deadline!</span>}
              {isOverdue && <span className="text-red-600 font-semibold ml-2">❗ Overdue!</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Overview;
