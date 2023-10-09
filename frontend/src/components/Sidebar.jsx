import { IconButton, Avatar, Box, CloseButton, Flex, HStack, VStack, Icon, useColorModeValue, Text, Drawer, DrawerContent, useDisclosure, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Image } from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu, FiChevronDown } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";

const LinkItems = [
  { name: "Home", icon: FiHome },
  { name: "Dashboard", icon: FiTrendingUp },
  { name: "Bills", icon: FiCompass },
  { name: "Settings", icon: FiSettings },
];

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box transition="3s ease" bg={useColorModeValue("white", "gray.900")} borderRight="1px" borderRightColor={useColorModeValue("gray.200", "gray.700")} w={{ base: "full", md: 60 }} pos="fixed" h="full" {...rest}>
      <Flex h="20" alignItems="center" mx="8" mt={4} mb={10} justifyContent="space-between">
        <Flex gap={2} alignItems={"center"} justifyContent={"center"}>
          <Image src="https://i.ibb.co/LzsMhD0/mekdilogo2.png" w={"90%"} />
        </Flex>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Box as="a" href="#" style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "red",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="30"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
