type RangeHatchPatternProps = {
  id: string;
  size?: number;
};

export function RangeHatchPattern({ id, size = 7 }: RangeHatchPatternProps) {
  return (
    <pattern
      height={size}
      id={id}
      patternTransform="rotate(45)"
      patternUnits="userSpaceOnUse"
      width={size}
    >
      <rect className="fill-primary/8" height={size} width={size} />
      <line
        className="stroke-primary/30"
        strokeWidth={size / 6}
        x1={size / 2}
        x2={size / 2}
        y1="0"
        y2={size}
      />
    </pattern>
  );
}

export function RangeHatchSwatch({ id }: { id: string }) {
  return (
    <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
      <rect
        className="stroke-primary/70"
        fill={`url(#${id})`}
        height="11"
        rx="3"
        strokeWidth="1"
        width="11"
        x="0.5"
        y="0.5"
      />
    </svg>
  );
}
