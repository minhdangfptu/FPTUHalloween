import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./LoadingSkeletons.scss";

const SkeletonRows = ({ rows = 5, columns = 4 }) => (
  <div className="app-skeleton-table" aria-busy="true">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        className="app-skeleton-table__row"
        key={rowIndex}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((__, columnIndex) => (
          <Skeleton key={columnIndex} height={18} />
        ))}
      </div>
    ))}
  </div>
);

const SkeletonCards = ({ count = 3 }) => (
  <div className="app-skeleton-cards" aria-busy="true">
    {Array.from({ length: count }).map((_, index) => (
      <div className="app-skeleton-card" key={index}>
        <Skeleton height={120} borderRadius={14} />
        <Skeleton width="68%" height={22} />
        <Skeleton width="90%" />
        <Skeleton width="42%" />
      </div>
    ))}
  </div>
);

const DashboardSkeleton = () => (
  <div className="app-skeleton-dashboard" aria-busy="true">
    <div className="app-skeleton-dashboard__metrics">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="app-skeleton-dashboard__metric" key={index}>
          <Skeleton circle width={38} height={38} />
          <Skeleton width="62%" />
          <Skeleton width="38%" height={28} />
          <Skeleton width="75%" />
        </div>
      ))}
    </div>
    <div className="app-skeleton-dashboard__charts">
      <Skeleton height={260} borderRadius={16} />
      <Skeleton height={260} borderRadius={16} />
    </div>
  </div>
);

const ChatListSkeleton = () => (
  <div className="app-skeleton-chat-list" aria-busy="true">
    {Array.from({ length: 5 }).map((_, index) => (
      <div className="app-skeleton-chat-list__row" key={index}>
        <Skeleton circle width={42} height={42} />
        <div>
          <Skeleton width={130} />
          <Skeleton width={180} />
        </div>
      </div>
    ))}
  </div>
);

const ChatMessagesSkeleton = () => (
  <div className="app-skeleton-chat-messages" aria-busy="true">
    <Skeleton width="34%" height={52} borderRadius={14} />
    <Skeleton width="26%" height={52} borderRadius={14} containerClassName="app-skeleton-chat-messages__right" />
    <Skeleton width="42%" height={52} borderRadius={14} />
  </div>
);

const CartSkeleton = () => (
  <div className="app-skeleton-cart" aria-busy="true">
    <Skeleton width="34%" height={32} />
    <div className="app-skeleton-cart__layout">
      <Skeleton height={220} borderRadius={16} />
      <Skeleton height={220} borderRadius={16} />
    </div>
  </div>
);

const DetailSkeleton = () => (
  <div className="app-skeleton-detail" aria-busy="true">
    <Skeleton width="42%" height={34} />
    <Skeleton height={180} borderRadius={16} />
    <Skeleton count={4} />
  </div>
);

export {
  CartSkeleton,
  ChatListSkeleton,
  ChatMessagesSkeleton,
  DashboardSkeleton,
  DetailSkeleton,
  SkeletonCards,
  SkeletonRows,
};
