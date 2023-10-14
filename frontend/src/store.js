import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./slices/orderSlices";
import accountReducer from "./slices/accountSlices";

const store = configureStore({
	reducer: {
		order: orderReducer,
		account: accountReducer,
	},
});

export default store;
