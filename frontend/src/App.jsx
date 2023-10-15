import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { hideUnauthorizeModal } from "./slices/accountSlices";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddProduct from "./components/AddProduct";
import ListProduct from "./components/ListProduct";
import Cashier from "./components/Cashier";
import Reports from "./components/Reports";
import UpdateProfile from "./components/UpdateProfile";
import UpdateAdminProfile from "./components/UpdateAdminProfile";
import ListCategory from "./components/ListCategory";
import UserProfile from "./components/UserProfile";
import Menu from "./components/Menu";
import Menu2 from "./components/Menu2";

function AdminValidationModal() {
  const navigate = useNavigate();
  const { redirectTo, showUnauthorizedModal } = useSelector((state) => state?.account);
  const account = useSelector((state) => state?.account?.profile?.data?.profile?.isAdmin);
  const dispatch = useDispatch();
  return (
    <Modal
      isOpen={showUnauthorizedModal}
      onClose={() => {
        dispatch(hideUnauthorizeModal());
      }}
      closeOnOverlayClick={false}
      isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Permission Denied</ModalHeader>
        <ModalBody>{account === true ? "You're not a Cashier!" : "You're not an Admin!"}</ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={() => {
              navigate(redirectTo);
              dispatch(hideUnauthorizeModal());
            }}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin/addproduct" element={<AddProduct />} />
        <Route path="/admin/category" element={<ListCategory />} />
        <Route path="/admin/listproduct" element={<ListProduct />} />
        <Route path="/admin/cashier" element={<Cashier />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/editprofile" element={<UpdateProfile />} />
        <Route path="/admin/editprofile" element={<UpdateAdminProfile />} />
        <Route path="/menu" element={<Menu2 />} />
        {/* <Route path="/menu2" element={<Menu/>} /> */}
      </Routes>
      <AdminValidationModal />
    </>
  );
}

export default App;
