import { Toast } from "bootstrap";

document.querySelector("#modal-reset-password-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const toastElements = document.querySelectorAll(".toast");
  const toasts = [...toastElements].map((e) => Toast.getOrCreateInstance(e));
  toasts.forEach((toast) => toast.show());
});
