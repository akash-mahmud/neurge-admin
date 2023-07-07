import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../../apollo/client";
import {  LoginAdminDocument, LoginAdminMutation, LoginAdminMutationVariables, User } from "../../../graphql/generated/schema";
import { CreateOneUserArgsCustom } from "../../../graphql/generated/schema";
import { clearAuthState } from "@/utils/persisted.store";
export interface IinitialStateAuth {
  isAuthenticated: Boolean;
  user: User | undefined | null;
  token: String | null | undefined;
  loading: Boolean;
  isError: Boolean;
  error: String | undefined;
}
const initialState: IinitialStateAuth = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  isError: false,
  error: "",
};

export const login = createAsyncThunk<
  LoginAdminMutation | null | undefined,
  LoginAdminMutationVariables
>(
  "auth/login",

  async ({email , password}:LoginAdminMutationVariables , thunkAPI) => {
    try {
      const { data } = await client.mutate({
        mutation: LoginAdminDocument,
        variables: {
          email , password
        },
      });

      return data;
    } catch (error:any) {
      // console.error(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// export const register = createAsyncThunk<
//   RegisterMutation | null | undefined,
//   CreateOneUserArgsCustom
// >("auth/register", async (input:CreateOneUserArgsCustom , thunkAPI) => {
//   try {
    
//     const { data } = await client.mutate({
//       mutation: RegisterDocument,
//       variables: {
//         input
//       },
//     });

//     return data;
//   } catch (error) {
//     console.error(error);
//     return thunkAPI.rejectWithValue(null);
//   }
// });

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, payload) => {
        state.loading = false;
        state.user = payload.payload?.loginAdmin?.user as User;
        state.isAuthenticated = payload.payload?.loginAdmin?.isAuthenticated|| false;
        state.token = payload.payload?.loginAdmin?.accessToken;
        state.isError = false;
        state.error = "";
      })
      .addCase(login.rejected, (state, payload) => {
        state.user = null;
        state.loading = false;
        state.isError = true;
        state.error = payload.error.message


      });
    //===== sign up =======
    // builder
    //   .addCase(register.pending, (state) => {
    //     state.loading = true;
    //     state.isError = false;
    //     state.error = "";
    //   })
    //   .addCase(register.fulfilled, (state, payload) => {
    //     state.loading = false;
    //     state.user = null ;
    //     state.isAuthenticated = true;
    //     state.token = null;
    //     state.isError = false;
    //     state.error = "";
    //   })
    //   .addCase(register.rejected, (state, payload) => {
    //     state.user = null;
    //     state.loading = false;
    //     state.isError = true;

    //   });
   
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;


