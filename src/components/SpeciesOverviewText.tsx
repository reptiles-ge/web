import { PhoneLinkedText } from "@/components/PhoneLinkedText";

type SpeciesOverviewTextProps = {
  body: string;
};

export function SpeciesOverviewText({ body }: SpeciesOverviewTextProps) {
  return (
    <p className="mt-8 max-w-2xl scroll-mt-40 text-[17px] leading-relaxed whitespace-pre-line text-foreground/85 sm:text-[18px]">
      <PhoneLinkedText>{body}</PhoneLinkedText>
    </p>
  );
}
