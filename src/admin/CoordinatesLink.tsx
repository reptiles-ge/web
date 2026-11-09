import { Typography } from "antd";

export function CoordinatesLink({ lat, lng }: { lat?: number; lng?: number }) {
  if (lat === undefined || lng === undefined) return "—";
  return (
    <Typography.Link
      href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=12/${lat}/${lng}`}
      rel="noreferrer"
      target="_blank"
    >
      {lat.toFixed(4)}, {lng.toFixed(4)}
    </Typography.Link>
  );
}
