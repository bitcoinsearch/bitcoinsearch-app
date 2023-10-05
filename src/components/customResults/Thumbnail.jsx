/* eslint-disable @next/next/no-img-element */
import React from "react";
import { parseYoutubeId } from "../../utils/views";
import Image from "next/image";

export const Thumbnail = ({ url }) => {
  if (!url) return null;

  const youtubeId = parseYoutubeId(url);
  if (!youtubeId) return null;
  const thumbnailURL = `https://i3.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div className="search-result-media">
        <img src={thumbnailURL} alt="thumbnail" />
        <div className="play-button">
          <svg
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path>
          </svg>
        </div>
      </div>
    </a>
  );
};
