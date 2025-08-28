"use client";
import { useState } from "react";
import PollutionForm from "./PollutionForm";

interface PollutionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initial?: any;
}

export default function PollutionModal({ open, onClose, onSuccess, initial }: PollutionModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        <h2 className="text-xl font-bold mb-2">{initial ? "Edit Pollution Record" : "Add New Pollution Record"}</h2>
        <p className="text-gray-500 mb-4">Enter the pollution measurement data for a specific month and year.</p>
        <PollutionForm onSuccess={onSuccess} initial={initial} />
      </div>
    </div>
  );
}
