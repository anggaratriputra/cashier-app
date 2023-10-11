import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function ListUpdate({ isOpen, categoryToEdit, onSave, onClose }) {
  const [newCategoryName, setNewCategoryName] = useState(categoryToEdit.name);

  const handleSave = () => {
    onSave(categoryToEdit.id, newCategoryName);
    onClose();
  };

  //every change at categoryToEdit, state will be updated to the last change
  useEffect(() => {
    setNewCategoryName(categoryToEdit.name);
  }, [categoryToEdit]);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input placeholder="Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
