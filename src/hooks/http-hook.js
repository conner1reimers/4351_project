import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = useCallback(async (urlPath, method = 'GET', body = null, headers = {}) => {
    // TRY CATCH BLOCK FOR SENDING REQUEST WITH THE METHOD, BODY, AND HEADERS WE GIVE IT
    setIsLoading(true);
    try {
      const response = await fetch(`BACKEND_APP_URL/${urlPath}`, {
        method,
        body,
        headers
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return responseData;
    } catch (err) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      throw err;
    }
  }, []);

  return { isLoading, sendRequest };
};
