import React from "react";
import { CgNotes } from "react-icons/cg";

const ChatButton = ({ toggleChatVisibility }) => (
  <button
    onClick={toggleChatVisibility}
    className="absolute top-4 right-4 transition"
  >
    <CgNotes className="mr-2 text-blue-400" />
  </button>
);

export default ChatButton;
