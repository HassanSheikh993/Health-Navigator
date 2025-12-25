import toast from "react-hot-toast";

export function confirmToast(message) {
  return new Promise((resolve) => {
    toast((t) => (
      <div className="toast-confirm">
        <p>{message}</p>

        <div className="toast-buttons">
          <button
            className="btn-cancel"
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
          >
            Cancel
          </button>

          <button
            className="btn-delete"
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  });
}
