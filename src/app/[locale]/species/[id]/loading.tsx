export default function SpeciesLoading() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto flex h-[70svh] min-h-[420px] max-w-[1400px] flex-col justify-end px-6 pb-12 lg:h-[75svh] lg:px-10 lg:pb-16">
        <div className="h-3 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mt-6 h-14 w-[min(100%,28rem)] animate-pulse rounded-2xl bg-white/10" />
        <div className="mt-4 h-6 w-48 animate-pulse rounded-full bg-white/10" />
        <div className="mt-8 h-16 w-[min(100%,24rem)] animate-pulse rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}
