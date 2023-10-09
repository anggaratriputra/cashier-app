import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./slices/transactionSlices";
import accountReducer from "./slices/accountSlices";

const store = configureStore({
	reducer: {
		transaction: transactionReducer,
		account: accountReducer,
	},
});

export default store;
