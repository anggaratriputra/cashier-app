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
import Settings from "./components/Settings";
import Reports from "./components/Reports";
import UpdateProfile from "./components/UpdateProfile";
import UpdateAdminProfile from "./components/UpdateAdminProfile";
import ListCategory from "./components/ListCategory";


function AdminValidationModal() {
  const navigate = useNavigate();
  const { redirectTo, showUnauthorizedModal } = useSelector((state) => state.account);
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
        <ModalBody>You are not an admin.</ModalBody>
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
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/editprofile" element={<UpdateProfile />} />
        <Route path="/admin/editprofile" element={<UpdateAdminProfile />} />
      </Routes>
      <AdminValidationModal />
    </>
  );
}

export default App;
