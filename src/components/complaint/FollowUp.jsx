import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';

export const FollowUp = ({ complaint, onSendFollowUp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const defaultMessage = `Hello, I am following up on complaint ${complaint.id} regarding the reported ${complaint.category.toLowerCase()}. The issue is still unresolved. Please provide an update.`;
  const [message, setMessage] = useState(defaultMessage);

  if (complaint.status === 'Resolved') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await onSendFollowUp(complaint.id, message);
      setSentSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSentSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="rounded-lg border border-[#DDE1E7] bg-white p-5 space-y-4">
      {!isOpen ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold font-heading text-[#14213D]">
              Still not resolved?
            </h4>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              Send an official follow-up nudge to the assigned municipal engineering division.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 self-start sm:self-auto"
          >
            <MessageSquare className="w-4 h-4 text-[#E8963C]" />
            Send a follow-up
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE1E7] pb-2">
            <h4 className="text-sm font-semibold font-heading text-[#14213D] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#E8963C]" />
              Official Follow-up Message
            </h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-[#14213D]"
            >
              Cancel
            </button>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-[#F4F5F7] border border-[#DDE1E7] rounded-md text-sm text-[#14213D] font-sans focus-visible:ring-2 focus-visible:ring-[#E8963C]"
          />

          {sentSuccess ? (
            <p className="text-xs font-semibold font-sans text-[#4A9B6E]">
              ✓ Follow-up message sent successfully to control desk.
            </p>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={isSending}
              >
                Dismiss
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSending}
                className="flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Send follow-up
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
