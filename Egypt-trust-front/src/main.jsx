import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import UserProvider from './Context/Usercontext.jsx';

let query = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={query}>
      <UserProvider>
        <App />
      </UserProvider>
      <ReactQueryDevtools position='bottom-right' />
    </QueryClientProvider>
    <ToastContainer position='bottom-right' />
  </StrictMode>,
)
