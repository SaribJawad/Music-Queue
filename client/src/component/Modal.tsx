import Button from "./Button";

interface ModalProps {
  content: string;
  buttonContent: string;
  buttonOnClick: () => void;
  handleModal: (arg: boolean) => void;
}

function Modal({
  buttonContent,
  content,
  handleModal,
  buttonOnClick,
}: ModalProps) {
  return (
    <section
      onClick={() => handleModal(false)}
      className="h-dvh w-full bg-black bg-opacity-90 absolute flex   top-0 left-0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-[90%] sm:w-[400px] rounded-md my-auto mx-auto bg-background_dark_secondary p-4 gap-14 flex flex-col justify-around"
      >
        <h3>{content}</h3>
        <div className="flex justify-end gap-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleModal(false);
            }}
            size="sm"
          >
            Cancel
          </Button>
          <Button onClick={buttonOnClick} size="sm">
            {buttonContent}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Modal;
