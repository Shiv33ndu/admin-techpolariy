export default function Modal({
  open,
  children,
  onClose,
}) {

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        justify-center
        items-center
        z-50
        p-6
      "
      onClick={onClose}
    >

      <div
        className="
          bg-white
          rounded-3xl
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          shadow-2xl
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {children}

      </div>

    </div>
  );
}