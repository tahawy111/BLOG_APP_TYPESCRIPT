export function IconBtn({
  Icon,
  isActive,
  color,
  children,
  ...props
}:
  | {
      Icon: any;
      isActive?: boolean;
      color?: string;
      children?: any;
    }
  | any) {
  return (
    <button
      className={`btn icon-btn ${isActive ? "icon-btn-active" : ""} ${
        color || ""
      }`}
      {...props}
    >
      <span className={`${children != null ? "mr-1" : ""}`}>
        <Icon />
      </span>
      {children}
    </button>
  );
}
