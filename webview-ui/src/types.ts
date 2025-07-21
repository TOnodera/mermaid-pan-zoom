declare global {
  const acquireVsCodeApi: () => {
    postMessage: (msg: { type: string }) => void;
  };
}
