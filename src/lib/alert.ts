import Swal from "sweetalert2";

export const showError = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
  });
};

export const showSuccess = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
  });
};

export const showConfirm = async (message: string) => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Konfirmasi",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });

  return result.isConfirmed;
};