import { useState } from "react";
import TransferencesHeader from "./TransferencesHeader";
import TransferencesBody from "./TransferencesBody";

export default function Transferences() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`
      fixed bottom-4 right-4 w-96 bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out z-50 font-sans
      ${isOpen ? "max-h-[80vh]" : "max-h-14 w-[192px]"}
    `}
    >
      <TransferencesHeader isOpen={isOpen} toggleHeader={() => setIsOpen(!isOpen)}/>
      <TransferencesBody isOpen={isOpen}/>
    </div>
  );
}
