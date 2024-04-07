import Swal from "sweetalert2";

export function showAlert(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    showConfirmButton: false,
    width: 500,
    timer: 2000,
  });
}
