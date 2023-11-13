import { createContext, useContext, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// CSS Styles using styled-components
const fade_in = keyframes`
  from { opacity: 0 }
`;

const fade_out = keyframes`
  to { opacity: 0 }
`;

const slide_in = keyframes`
  from { transform: translateY(var(--_travel-distance, 10px)) }
`;

const ToastContainer = styled.section`
  position: fixed;
  z-index: 1;
  bottom: 0;
  right: 0;
  left: 0;
  padding-bottom: 5vh;

  display: grid;
  justify-items: center;
  justify-content: center;
  gap: 1vh;

  /* optimizations */
  pointer-events: none;
`;

const Toast = styled.output`
  --_duration: 3s;
  --_bg-lightness: 90%;
  --_travel-distance: 0;

  font-family: system-ui, sans-serif;
  color: black;
  background: hsl(0 0% var(--_bg-lightness) / 90%);
  border-radius:1000px;
  
  max-inline-size: min(25ch, 90vw);
  padding-block: .5ch;
  padding-inline: 1ch;
  border-radius: 3px;
  font-size: 1rem;

  will-change: transform;
  animation: 
    ${fade_in} .3s ease,
    ${slide_in} .3s ease,
    ${fade_out} .3s ease var(--_duration);
`;

// Create Context
const ToastContext = createContext();

// Custom hook
export const useToast = () => useContext(ToastContext);

// Add toast logic
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toasts.length > 0) {
        setToasts(toasts.slice(1));
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [toasts]);

  const pushToast = toastMessage => {
    setToasts([...toasts, toastMessage]);
  };

  return (
    <ToastContext.Provider value={pushToast}>
      {children}
      <ToastContainer>
        {toasts.map((toastMessage, i) => (
          <Toast key={i}>{toastMessage}</Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};