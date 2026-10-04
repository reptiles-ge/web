const EYES = [20, 44] as const;
const SPOTS = [
  [32, 22, 1.5],
  [25, 26, 1.1],
  [39, 26, 1.1],
  [32, 28, 0.9],
] as const;

type Props = {
  happy: boolean;
  mood: number;
};

export function SiteRatingMascot({ happy, mood }: Props) {
  const lookX = mood ? (mood - 3) * 0.9 : 0;
  const lookY = mood ? 1.3 : 0;
  const smile = happy ? 6 : mood ? (mood - 2.5) * 2 : 1.6;
  const tilt = happy || !mood ? 0 : (mood - 3) * 2.5;

  return (
    <svg
      aria-hidden="true"
      className="h-10 w-16 overflow-visible transition-transform duration-300 ease-out motion-reduce:transition-none"
      style={{ transform: `rotate(${tilt}deg)`, transformOrigin: "50% 100%" }}
      viewBox="0 0 64 40"
    >
      {EYES.map((cx) => (
        <circle className="fill-primary" cx={cx} cy="15" key={cx} r="8.5" />
      ))}
      <ellipse className="fill-primary" cx="32" cy="31" rx="21" ry="14" />
      {SPOTS.map(([cx, cy, r]) => (
        <circle
          className="fill-gold opacity-70"
          cx={cx}
          cy={cy}
          key={`${cx}-${cy}`}
          r={r}
        />
      ))}
      <g className="origin-center animate-[rating-blink_5s_ease-in-out_1.5s_infinite] transform-fill motion-reduce:animate-none">
        {EYES.map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="15" fill="#fff" r="5.6" />
            {happy ? (
              <path
                className="fill-none stroke-ink"
                d={`M ${cx - 3.2} 16.4 Q ${cx} 11.4 ${cx + 3.2} 16.4`}
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            ) : (
              <g
                className="transition-transform duration-200 ease-out motion-reduce:transition-none"
                style={{ transform: `translate(${lookX}px, ${lookY}px)` }}
              >
                <circle className="fill-ink" cx={cx} cy="15" r="2.8" />
                <circle cx={cx + 1} cy="13.9" fill="#fff" r="0.9" />
              </g>
            )}
          </g>
        ))}
      </g>
      {EYES.map((cx) => (
        <ellipse
          className="fill-destructive transition-opacity duration-300 motion-reduce:transition-none"
          cx={cx < 32 ? 16.5 : 47.5}
          cy="31"
          key={cx}
          opacity={happy || mood >= 4 ? 0.4 : 0}
          rx="3.2"
          ry="1.9"
        />
      ))}
      <circle className="fill-ink opacity-45" cx="29.4" cy="30" r="0.8" />
      <circle className="fill-ink opacity-45" cx="34.6" cy="30" r="0.8" />
      <path
        className="fill-none stroke-ink opacity-70"
        d={`M 25 34.5 Q 32 ${34.5 + smile} 39 34.5`}
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
