import { createSlice } from "@reduxjs/toolkit"
import axios from "../axios"


const initialState = {
    user: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state, action) => {
            localStorage.removeItem("token")
            localStorage.removeItem("users")
            state.user = null
        }

    }
})

export const { setUser, logout } = userSlice.actions


export const getUser = (state) => {
    return state.userInfo.user
}

export default userSlice.reducer


// export const handleLogin = (token) => {
//     return (
//         async (dispatch) => {
//             const response = await axios.get("/user/data", {
//                 headers: {
//                     Authorization: token
//                 }
//             })
//             const storedData = JSON.stringify( response.data)
//             //console.log(storedData);
//             localStorage.setItem("users", storedData);
//             dispatch(setUser(response.data))
//         }

//     )
// }

export const handleLogin = (token) => async (dispatch) => {
    try {
     
      const response = await axios.get("/user/data", {
        headers: {
          Authorization: token
        }
      });
      const storedData = JSON.stringify(response.data);
     
      localStorage.setItem("users", storedData);
      dispatch(setUser(response.data));
    } catch (error) {
      // Handle errors here, such as invalid token or network issues
      console.error("Error during login:", error);
      throw error; // Rethrow the error to handle it in the component
    }
  };