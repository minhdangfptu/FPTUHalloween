import "./ThemeAsset.css";

const ThemeAsset = ({ lightSrc, darkSrc, alt = "", className = "", ...props }) => {
  const sharedClassName = `theme-asset ${className}`.trim();

  return (
    <>
      <img
        {...props}
        src={lightSrc}
        alt={alt}
        className={`${sharedClassName} theme-asset--light`}
      />
      <img
        {...props}
        src={darkSrc}
        alt=""
        aria-hidden="true"
        className={`${sharedClassName} theme-asset--dark`}
      />
    </>
  );
};

export default ThemeAsset;