export const formatTimeAgo = (date: string | number) => {
  const now = new Date();
  const past = new Date(date);
  const diffTime = Math.abs(now.getTime() - past.getTime());
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffHours < 24) {
    if (diffHours === 0) return "Less than an hour ago";
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};
