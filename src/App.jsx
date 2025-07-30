import React, { useEffect, useState } from 'react';

function App() {
  const [goals, setGoals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newGoal, setNewGoal] = useState({
    name: '',
    category: '',
    deadline: '',
    targetAmount: '',
    deliverables: '',
  });

  useEffect(() => {
    fetch('http://localhost:3000/goals')
      .then((res) => res.json())
      .then(setGoals)
      .catch((err) => console.error('Error fetching goals:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const handleAddGoal = (e) => {
    e.preventDefault();

    const goalToAdd = {
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      savedAmount: 0,
      deliverables: newGoal.deliverables
        ? newGoal.deliverables.split(',').map((item) => item.trim())
        : [],
    };

    fetch('http://localhost:3000/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalToAdd),
    })
      .then((res) => res.json())
      .then((data) => {
        setGoals([...goals, data]);
        setNewGoal({
          name: '',
          category: '',
          deadline: '',
          targetAmount: '',
          deliverables: '',
        });
      });
  };

  const handleDeposit = (goalId, amount) => {
    const goal = goals.find((g) => g.id === goalId);
    const updatedGoal = {
      ...goal,
      savedAmount: goal.savedAmount + parseFloat(amount),
    };

    fetch(`http://localhost:3000/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedGoal),
    })
      .then((res) => res.json())
      .then((data) => {
        setGoals(goals.map((g) => (g.id === goalId ? data : g)));
      });
  };

  const filteredGoals = goals.filter((goal) =>
    goal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  


  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🎯 Smart Goal Planner</h1>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Home
        </button>
      </header>

      {/* Add Goal Form */}
      <form
        onSubmit={handleAddGoal}
        className="bg-white shadow p-4 rounded mb-6 max-w-2xl mx-auto mt-6"
      >
        <h2 className="text-xl font-bold mb-4">➕ Add New Goal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={newGoal.name}
            onChange={handleInputChange}
            placeholder="Goal Name"
            className="border p-2 rounded"
            required
          />
          <input
            name="category"
            value={newGoal.category}
            onChange={handleInputChange}
            placeholder="Category"
            className="border p-2 rounded"
            required
          />
          <input
            name="deadline"
            value={newGoal.deadline}
            onChange={handleInputChange}
            type="date"
            className="border p-2 rounded"
            required
          />
          <input
            name="targetAmount"
            value={newGoal.targetAmount}
            onChange={handleInputChange}
            placeholder="Target Amount"
            type="number"
            className="border p-2 rounded"
            required
          />
          <input
            name="deliverables"
            value={newGoal.deliverables}
            onChange={handleInputChange}
            placeholder="Deliverables (comma-separated)"
            className="border p-2 rounded col-span-1 md:col-span-2"
          />
        </div>
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Goal
        </button>
      </form>

      {/* Search */}
      <div className="p-4 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search goals..."
          className="w-full px-4 py-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Goal Cards */}
      <main className="flex-grow px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGoals.map((goal) => (
            <div key={goal.id} className="bg-white p-4 rounded shadow hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{goal.name}</h2>
              <p className="text-sm mb-1">Category: {goal.category}</p>
              <p className="text-sm mb-1">Deadline: {goal.deadline}</p>
              <p className="text-sm mb-1">Target: ${goal.targetAmount}</p>
              <p className="text-sm mb-1">Saved: ${goal.savedAmount}</p>

              <div className="h-2 w-full bg-gray-200 rounded mt-2 mb-2">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{
                    width: `${(goal.savedAmount / goal.targetAmount) * 100}%`
                  }}
                />
              </div>

              {/* Deliverables */}
              {goal.deliverables && goal.deliverables.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium">📌 Deliverables:</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {goal.deliverables.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Deposit Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const amount = e.target.elements.depositAmount.value;
                  if (!amount) return;
                  handleDeposit(goal.id, amount);
                  e.target.reset();
                }}
                className="flex items-center gap-2 mt-2"
              >
                <input
                  name="depositAmount"
                  type="number"
                  step="0.01"
                  placeholder="Add deposit"
                  className="border px-2 py-1 rounded w-24"
                />
                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                  Deposit
                </button>
              </form>
            </div>
          ))}
        </div>
      </main>

      {/* Savings Overview */}
      <div className="bg-white p-4 rounded shadow max-w-2xl mx-auto my-8 text-center">
        <h2 className="text-xl font-semibold mb-2">📈 Savings Overview</h2>
        <p>Total Goals: {goals.length}</p>
        <p>
          Total Saved: ${goals.reduce((sum, g) => sum + g.savedAmount, 0).toFixed(2)}
        </p>
        <p>
          Total Target: ${goals.reduce((sum, g) => sum + g.targetAmount, 0).toFixed(2)}
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Smart Goal Planner — All rights reserved.
      </footer>
    </div>
  );
}

export default App;
