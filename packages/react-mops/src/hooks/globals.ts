export const useWindow = () => ("window" in global ? window : null);
export const useDocument = () => ("window" in global && window.document ? document : null);
