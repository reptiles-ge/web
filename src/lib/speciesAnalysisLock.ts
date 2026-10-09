const state = globalThis as typeof globalThis & {
  speciesAnalysisLocks?: Set<string>;
};
const running = (state.speciesAnalysisLocks ??= new Set<string>());

export function lockSpeciesAnalysis(id: string) {
  if (running.has(id))
    throw new Error("Analysis is already running for this species");
  running.add(id);
  return () => running.delete(id);
}
