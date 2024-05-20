import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ReactMarkdown from "react-markdown";

const ChatDialog = ({
  history,
  isProcessing,
  speechError,
  toggleChatVisibility,
}) => (
  <Dialog as="div" className="relative z-10" onClose={toggleChatVisibility}>
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
    </Transition.Child>

    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all text-white">
            <div className="w-full max-w-lg bg-gray-800 text-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-96">
              {history.map((item, index) => (
                <div
                  key={index}
                  className={
                    item.role === "user" ? "text-right mb-2" : "text-left mb-2"
                  }
                >
                  <span className="font-bold">
                    {item.role === "user" ? "You: " : "Model:"}
                  </span>
                  {item.role === "user" ? (
                    <span>{item.parts}</span>
                  ) : (
                    <ReactMarkdown className="prose prose-invert">
                      {item.parts}
                    </ReactMarkdown>
                  )}
                </div>
              ))}

              {isProcessing && (
                <div className="text-center text-yellow-500">Loading...</div>
              )}
              {speechError && (
                <div className="text-center text-red-500">
                  Error: {speechError}
                </div>
              )}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  </Dialog>
);

export default ChatDialog;
