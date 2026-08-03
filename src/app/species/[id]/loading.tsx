export default function SpeciesLoading() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto flex h-[100svh] max-w-[1400px] flex-col justify-end px-6 pb-24 lg:px-10">
        <div className="h-3 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mt-6 h-14 w-[min(100%,28rem)] animate-pulse rounded-2xl bg-white/10" />
        <div className="mt-4 h-6 w-48 animate-pulse rounded-full bg-white/10" />
        <div className="mt-8 h-16 w-[min(100%,24rem)] animate-pulse rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}
