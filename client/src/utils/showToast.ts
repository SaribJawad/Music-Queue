import toast from "react-hot-toast";

export const showToast = (
  type: "success" | "error" | "emoji",
  message: string
) => {
  const theme = localStorage.getItem("theme");
  const style =
    theme === "dark"
      ? { borderRadius: "10px", background: "#333", color: "#fff" }
      : { borderRadius: "10px", background: "#fff", color: "#333" };

  if (type === "success") {
    toast.success(message, {
      style,
    });
  } else if (type === "error") {
    toast.error(message, {
      style,
    });
  } else {
    toast(message, {
      icon: "👋",
      style,
    });
  }
};
