import React from "react";
import { getThumbnailUrl } from "../../utils/views";

export const Thumbnail = ({ url }) => {
  if (!url) return null;

  const thumbnailURL = getThumbnailUrl(url);

  if (!thumbnailURL) return null;

  return <img className="search-result-thumbnail" src={thumbnailURL} />;
};
