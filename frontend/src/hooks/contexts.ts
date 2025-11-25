import { useContext } from "react";
import { menuContext } from "../contexts/MenuContext";

export const useMenu = () => useContext(menuContext);
