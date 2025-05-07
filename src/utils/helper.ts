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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

export const  formatDuration = (seconds: number): string =>  {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hrs > 0) parts.push(`${hrs} hour${hrs !== 1 ? 's' : ''}`);
  if (mins > 0) parts.push(`${mins} minute${mins !== 1 ? 's' : ''}`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs} second${secs !== 1 && secs !== 0 ? 's' : ''}`);

  return parts.join(', ');
}
