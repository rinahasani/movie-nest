export const GoogleSignInButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-3 bg-white rounded-full hover:shadow-md disabled:opacity-50 flex items-center justify-center"
    >
      <img
        src="/images/google.png"
        alt="Google"
        className={`h-5 w-5 transition-opacity ${disabled ? "opacity-50" : "opacity-100"}`}
      />
    </button>
  );
  