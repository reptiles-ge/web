import { PhoneLinkedText } from "@/components/PhoneLinkedText";

type SpeciesOverviewTextProps = {
  body: string;
  editable?: boolean;
  speciesId?: string;
};

export function SpeciesOverviewText({
  body,
  editable,
  speciesId,
}: SpeciesOverviewTextProps) {
  return (
    <p
      className="mt-8 max-w-2xl scroll-mt-40 text-[17px] leading-relaxed whitespace-pre-line text-foreground/85 sm:text-[18px]"
      data-content-field={editable ? "overview" : undefined}
      data-content-id={editable ? speciesId : undefined}
    >
      <PhoneLinkedText>{body}</PhoneLinkedText>
    </p>
  );
}
