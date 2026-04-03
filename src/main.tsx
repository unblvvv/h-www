import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './styles/main.scss';

const savedTheme = window.localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;
document.documentElement.classList.toggle('dark', shouldUseDark);

createRoot(document.getElementById('root')!).render(<App />);
