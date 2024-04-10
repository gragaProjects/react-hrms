// import { configureStore } from '@reduxjs/toolkit';
// import userSlice from '../slices/userSlice';

// export default configureStore({
//   reducer: {
//     userInfo: userSlice,
//   },
// });
import { configureStore } from '@reduxjs/toolkit';
import userSlice, { setUser } from '../slices/userSlice'; // Importing setUser action
import organisationSlice, { fetchOrganisation } from '../slices/organisationSlice';
// Initialize Redux store with preloaded state
const store = configureStore({
  reducer: {
    userInfo: userSlice,
    organisation: organisationSlice,
  },
});

// Check for user data in local storage
const storedUserData = localStorage.getItem("users");

// If user data is available, dispatch setUser action to update Redux store
if (storedUserData) {
  store.dispatch(setUser(JSON.parse(storedUserData)));
}

//10.4.24
// Dispatch fetchOrganisation action to fetch organisation data when the application initializes
store.dispatch(fetchOrganisation());

export default store;

