import ReactModal from 'react-modal';

export function Modal({
  isOpen,
  onRequestClose,
  children,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      className="outline-none"
      overlayClassName="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      ariaHideApp={false}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        {children}
      </div>
    </ReactModal>
  );
}