//import react
import React, { useEffect, useState } from 'react';

//import redux
import { useDispatch } from 'react-redux';
import {tokenAdded  , checkToken} from '../features/auth/AuthSlice';
import { showMessage } from '../features/snackBar/snackBarSlice';

//import route
import AllRoute from '../routes/allRoutes';
import SplashScreen from './SplashScreen/SplashScreen';
import SnackBar from '../features/snackBar/snackBar message/SnackBar'

// import style
import style from './App.module.css'

function App() {
	const [flag , setFlag] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		const tokenCheck = async () => {
			if(localStorage.length!==0){
				const token = localStorage.getItem('token');
				dispatch(tokenAdded(token));
				try{
					await dispatch(checkToken()).unwrap();
				}catch(error){
					dispatch(showMessage({message: error , severity: 2}));
				}
			}
			setFlag(false);
		}

		tokenCheck();
	} , []);

	return (
		<div className={style.app}>
			{
				flag ?	<SplashScreen />
				: <AllRoute />
			}
			<SnackBar />
		</div>
	);
}

export default App;
