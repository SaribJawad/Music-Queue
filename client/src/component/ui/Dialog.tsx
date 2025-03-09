import { motion } from "motion/react";
import Button from "../Button";

interface DialogProps {
  closeDialog: () => void;
  onClickBtn: () => void;
  title: string;
  btnContent: string;
}

function Dialog({ closeDialog, btnContent, title, onClickBtn }: DialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        closeDialog();
      }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 h-full   flex items-center justify-center bg-[#0000007e]  z-1 w-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ ease: "backInOut" }}
        onClick={(e) => e.stopPropagation()}
        className="z-10 dark:bg-background_dark bg-background_light  rounded-md p-6 flex flex-col gap-3"
      >
        <h1 className="md:text-base sm:text-sm text-xs">{title}</h1>
        <div className="flex justify-center gap-3">
          <Button onClick={() => closeDialog()} type="button" size="sm">
            Cancel
          </Button>
          <Button onClick={() => onClickBtn()} type="button" size="sm">
            {btnContent}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Dialog;
