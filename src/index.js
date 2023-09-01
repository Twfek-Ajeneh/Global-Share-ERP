//import react
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'

//import redux
import { Provider } from 'react-redux';
import { store } from './app/store';

//import app
import App from './app/App';

//import global style
import './normalize.css';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	// <React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	// </React.StrictMode>
);