export function formatTranscriptOffset(anchorIso: string, lineIso: string): string {
  const diff = Math.max(0, new Date(lineIso).getTime() - new Date(anchorIso).getTime());
  const secs = Math.floor(diff / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
