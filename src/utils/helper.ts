import { AppError } from "@/types/types";

const ONE_KB = 1000;
const ONE_MB = 1000000;
const ONE_GB = ONE_MB * 1000;

export const octetsToReadableSize = (octets: number): string => {
  if (octets >= ONE_GB) {
    const gb = (octets / ONE_GB).toFixed(2);
    return `${gb} GB`;
  } else if (octets >= ONE_MB) {
    const mb = (octets / ONE_MB).toFixed(2);
    return `${mb} MB`;
  } else if (octets >= ONE_KB) {
    const kb = (octets / ONE_KB).toFixed(2);
    return `${kb} KB`;
  } else {
    return `${octets} B`; 
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

export const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hrs > 0) parts.push(`${hrs} hour${hrs !== 1 ? 's' : ''}`);
  if (mins > 0) parts.push(`${mins} minute${mins !== 1 ? 's' : ''}`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs} second${secs !== 1 && secs !== 0 ? 's' : ''}`);

  return parts.join(', ');
}


export const getFriendlyErrorMessage = (error: AppError): string => {
  switch (error.type) {
    case 'databaseError':
      if (error.message.includes('FOREIGN KEY')) {
        return 'Something is missing — please check your inputs.';
      }
      return 'We couldn’t save your data. Please try again.';
    case 'filesError':
      if (error.message.includes('One of the Folders')) {
        return 'It seems one of the folders or devices didn’t connect properly. Please check your connections before attempting the backup.';
      }
      return 'There was an issue with the files. Please check your setup and try again.';

    default:
      return 'An unknown error occurred.';
  }
}

export const getPercentage = (progress:number,total:number) => {
  return Math.min(Math.round((progress / total) * 100), 100);
}