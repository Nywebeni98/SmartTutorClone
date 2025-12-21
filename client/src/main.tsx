import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    console.log('Cleanup SW registered');
    registration.update();
  }).catch((error) => {
    console.log('SW registration failed:', error);
  });
  
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_CLEARED') {
      console.log('Cache cleared, reloading...');
      window.location.reload();
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
