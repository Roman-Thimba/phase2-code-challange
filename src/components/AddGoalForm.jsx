const handleAddGoal = async (e) => {
  e.preventDefault();

  const { name, category, deadline, targetAmount, deliverables } = newGoal;

  if (!name || !category || !deadline || !targetAmount) {
    alert("Please fill out all required fields.");
    return;
  }

  const parsedAmount = parseFloat(targetAmount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    alert("Please enter a valid target amount.");
    return;
  }

  const goalToAdd = {
    name: name.trim(),
    category: category.trim(),
    deadline,
    targetAmount: parsedAmount,
    savedAmount: 0,
    deliverables: deliverables
      ? deliverables.split(',').map((d) => d.trim()).filter(Boolean)
      : [],
  };

  try {
    const res = await fetch('http://localhost:3001/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalToAdd),
    });

    if (!res.ok) {
      throw new Error('Failed to add goal.');
    }

    const data = await res.json();
    setGoals((prevGoals) => [...prevGoals, data]);

    // Clear form
    setNewGoal({
      name: '',
      category: '',
      deadline: '',
      targetAmount: '',
      deliverables: '',
    });
  } catch (error) {
    console.error('Error adding goal:', error);
    alert('Failed to add goal. Please check your server or inputs.');
  }
};
