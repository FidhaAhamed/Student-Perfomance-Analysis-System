export async function getAssociationRules() {
  const response = await fetch('http://localhost:5000/rules');
  return await response.json();
}

export async function getPerformanceSummary() {
  const response = await fetch('http://localhost:5000/summary');
  if (!response.ok) throw new Error('Failed to fetch summary');
  return await response.json();
}

export async function getAtRiskStudents() {
  const response = await fetch('http://localhost:5000/at-risk');
  if (!response.ok) throw new Error('Failed to fetch at-risk students');
  return await response.json();
}