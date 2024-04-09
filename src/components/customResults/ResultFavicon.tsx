import Image from "next/image";
import React, { useCallback, useState } from "react";

type ResultFaviconProps = React.ComponentProps<typeof Image> & {
  fallbackUrl?: string;
  numbersOfRetry?: number;
};

const ResultFavicon = ({
  alt,
  fallbackUrl = "/default_favicon.svg",
  numbersOfRetry = 3,
  ...props
}: ResultFaviconProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [src, setSrc] = useState(props.src);

  const onError = useCallback(() => {
    if (retryCount < numbersOfRetry) {
      setRetryCount((count) => count + 1);
      return;
    }

    setSrc(fallbackUrl);
  }, [fallbackUrl, numbersOfRetry, retryCount]);

  return (
    <Image
      key={retryCount.toString()}
      className="rounded-xl"
      width={24}
      height={24}
      alt={alt}
      {...props}
      onError={onError}
      src={src}
    />
  );
};

export default ResultFavicon;
