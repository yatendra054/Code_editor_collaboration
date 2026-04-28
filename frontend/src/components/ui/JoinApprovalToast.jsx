import React from 'react';

const JoinApprovalToast = ({ userName, onAccept, onDecline, closeToast }) => {
  return (
    <div className="flex flex-col gap-3 p-1">
      <div className="text-sm font-medium text-gray-100">
        <span className="text-blue-400 font-bold">{userName}</span> wants to join this room.
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            onDecline();
            closeToast();
          }}
          className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Decline
        </button>
        <button
          onClick={() => {
            onAccept();
            closeToast();
          }}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default JoinApprovalToast;
