import { toast } from "react-toastify";

export const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("✅ Link został skopiowany do schowka!");
    } catch (err) {
      console.error("Błąd podczas kopiowania: ", err);
      toast.error("❌ Nie udało się skopiować linku");
    }
  };