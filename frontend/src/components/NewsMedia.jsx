import fallbackNewsImage from "../assets/hlw/2025.jpg";

const fallbackMediaStyle = { backgroundImage: `url(${fallbackNewsImage})` };

const getImageUrl = (images) => {
  const value = Array.isArray(images) ? images[0] : "";
  return typeof value === "string" ? value.trim() : "";
};

const NewsMedia = ({ className, images, loading = "lazy" }) => {
  const imageUrl = getImageUrl(images);

  return (
    <div className={className} style={fallbackMediaStyle} aria-hidden="true">
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          loading={loading}
          onError={(event) => { event.currentTarget.style.display = "none"; }}
          key={imageUrl}
        />
      )}
    </div>
  );
};

export default NewsMedia;
