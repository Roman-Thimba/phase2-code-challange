
import GoalItem from './GoalItem';

function GoalList({ goals, onUpdateGoal, onDeleteGoal }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Goals</h2>
      {goals.map(goal => (
        <GoalItem
          key={goal.id}
          goal={goal}
          onUpdateGoal={onUpdateGoal}
          onDeleteGoal={onDeleteGoal}
        />
      ))}
    </div>
  );
}

export default GoalList;
;
