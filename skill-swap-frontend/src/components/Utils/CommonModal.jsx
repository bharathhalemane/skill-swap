import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

const CommonModal = ({ isOpen, onClose, title, children, width = "400px" }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        },
        content: {
          position: "relative",
          inset: "auto",
          width: width,
          padding: "30px",
          borderRadius: "16px",
          border: "none",
          margin: "20px"
        }
      }}
    >
      {title && <h3 className="modal-title">{title}</h3>}
      {children}
    </ReactModal>
  );
};

export default CommonModal;