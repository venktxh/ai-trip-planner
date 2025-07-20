// src/service/AIModal.jsx

export async function generateTripPlan({ location, days, people, budget }) {
  try {
    const response = await fetch('http://localhost:5000/api/generate-trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, days, people, budget }),
    });

    if (!response.ok) throw new Error('Backend returned an error');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Frontend error:', error);
    throw error;
  }
}
