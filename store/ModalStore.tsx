import { create } from "zustand";
import React from "react";

interface Modal {
  isModalOpen: boolean;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  content: React.ReactNode | null;
}

export const useModalStore = create<Modal>((set) => ({
  isModalOpen: false,
  content: null,
  openModal: (content) => set({ isModalOpen: true, content }),
  closeModal: () => set({ isModalOpen: false, content: null }),

 
}));
