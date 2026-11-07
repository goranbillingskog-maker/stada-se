export default function Tag({ children, isRut = false, className = "", style = {} }) {
  return (
    <span
      className={`tag ${isRut ? "tag--rut" : ""} ${className}`.trim()}
      style={style}
    >
      {children}
    </span>
  );
}
