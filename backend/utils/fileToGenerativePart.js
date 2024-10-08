export function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(path).toString("base64"),
      mimeType,
    },
  };
}
