/**
 * Build a remotion render CLI command string
 */
export function buildRenderCommand(compositionId: string, props: Record<string, unknown>): string {
  const propsJson = JSON.stringify(props).replace(/'/g, "\\'");
  return `remotion render src/index.ts ${compositionId} --props '${propsJson}' out/${compositionId}.mp4`;
}
