import AnimatedNumbers from "react-animated-numbers";

// Balance display component
export const NumberDisplay = ({ number, title, symbol }: {
  number: number | null,
  title: string,
  symbol?: string | null,
}) => (
  <div className="mt-2 text-sm flex items-center gap-1">
    <span className="font-semibold mr-1">{title}:</span>
    <AnimatedNumbers
      includeComma
      transitions={(index) => ({
        type: "spring",
        duration: index + 0.3,
      })}
      key={number?.toString()}
      animateToNumber={number !== null ? number : 0}
    />
    <span>
      {symbol}
    </span>
  </div>
);
