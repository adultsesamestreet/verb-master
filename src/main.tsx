import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure the DOM is ready before rendering
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  
  // Add error boundary for better error handling
  try {
    root.render(<App />);
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="color: #dc2626; margin-bottom: 16px;">Loading Error</h1>
          <p style="color: #6b7280; margin-bottom: 16px;">
            There was an issue loading Abel's Wordsmith. Please try refreshing the page.
          </p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: #2563eb;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
            "
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
}
