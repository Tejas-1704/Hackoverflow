"use client"
import { useState } from 'react';

const PromptDesc = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePrompt = async (prompt) => {
    const api_url = "https://gigagen.pythonanywhere.com/health_query";
    const data = {
      'user_input': prompt,
    };

    try {
      const response = await fetch(api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setResult(responseData);
    } catch (error) {
      setError(error.message);
    }
  };

  return {result ,error,handlePrompt,setResult}
};

export default PromptDesc;
