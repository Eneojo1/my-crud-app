type LoadingProps = {
  size?: number;
};

const Loading = ({ size = 80 }: LoadingProps) => {
  return (
    <div
      className="relative animate-spin"
      style={{
        width: size,
        height: size,
      }}
    >
      {[...Array(11)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-pr1 rounded left-1/2 top-1/2 "
          style={{
            width: "4%",
            height: "20%",
            transformOrigin: "center",
            transform: `translate(-50%, -50%) rotate(${i * 33}deg) translateY(-120%)`,
            opacity: (i + 1) / 12,
          }}
        />
      ))}
    </div>
  );
};

export default Loading;
