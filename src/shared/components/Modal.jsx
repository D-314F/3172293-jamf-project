// src/shared/components/Modal.jsx
export default function Modal({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
      <div className="bg-zinc-900 border-4 border-[var(--color-brand)] rounded-xl p-6 shadow-2xl text-[var(--color-text-inverse)] max-w-lg w-full">
        {children}
        <div className="flex justify-end mt-4">
          
        </div>
      </div>
    </div>
  );
}
