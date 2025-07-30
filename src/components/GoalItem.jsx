
import { useState } from 'react';

function GoalItem({ goal, onUpdateGoal, onDeleteGoal }) {
  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = () => {
    const newSavedAmount = parseFloat(goal.savedAmount) + parseFloat(depositAmount);
    onUpdateGoal(goal.id, { savedAmount: newSavedAmount });
    setDepositAmount('');
  };

  const progressPercent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100).toFixed(1);

  return (
    <div className="border rounded p-3 shadow bg-white">
      <h3 className="font-bold text-lg">{goal.name}</h3>
      <p>Category: {goal.category}</p>
      <p>Target: ${goal.targetAmount} | Saved: ${goal.savedAmount}</p>
      <div className="w-full bg-gray-200 rounded h-3 my-2">
        <div
          className="bg-green-500 h-3 rounded"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Deposit Amount"
          className="border p-1 rounded flex-1"
        />
        <button
          onClick={handleDeposit}
          className="bg-green-600 text-white px-2 rounded hover:bg-green-700"
        >
          Deposit
        </button>
        <button
          onClick={() => onDeleteGoal(goal.id)}
          className="bg-red-600 text-white px-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default GoalItem;
