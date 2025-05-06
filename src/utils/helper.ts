const ONE_KB = 1000;
const ONE_MB = 1000000;

export const octetsToReadableSize = (octets: number): string => {
  if (octets >= ONE_MB) {
    const mb = (octets / ONE_MB).toFixed(2);
    return `${mb} MB`;
  } else {
    const kb = (octets / ONE_KB).toFixed(2);
    return `${kb} KB`;
  }
};
