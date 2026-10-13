const PLACEHOLDER = /\{\{|\}\}|\{[^}]*\}/;

export function PhotoPermissionNotes({
  className,
  notes,
}: {
  className?: string;
  notes: readonly string[];
}) {
  const visible = photoPermissionNotes(notes);
  if (visible.length === 0) return null;
  return <p className={className}>{visible.join(" ")}</p>;
}

function photoPermissionNotes(notes: readonly string[]) {
  return notes
    .map((note) => note.trim())
    .filter((note) => note.length > 0 && !PLACEHOLDER.test(note));
}
