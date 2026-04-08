const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Balance function
export const getBalance = async (token: string) => {
  const res = await fetch(`${API_URL}/tokens/balance`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
};

// Prediction function
export const getPrediction = async (token: string) => {
  const res = await fetch(`${API_URL}/usage/predict`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return handleResponse(res);
};

// Alert function
export const getAlert = async (token: string) => {
  const res = await fetch(`${API_URL}/usage/alert`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
};

// Log usage function
export const logUsage = async (token: string, unitsUsed: number) => {
  const res = await fetch(`${API_URL}/usage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ unitsUsed }),
  });

  return handleResponse(res);
};

// Usage History function
export const getUsageHistory = async (token: string) => {
  const res = await fetch(`${API_URL}/usage/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res);
};

// Login function
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(res);
};

// Register function
export const registerUser = async (
  name: string, 
  email: string, 
  password: string
) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(res);
};

// Initialize Units function
export const initializeUnits = async (token: string, units: number) => {
  const res = await fetch(`${API_URL}/tokens/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ units }),
  });

  return handleResponse(res);
};

// Handle response function
const handleResponse = async (res: Response) => {
  let data = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};