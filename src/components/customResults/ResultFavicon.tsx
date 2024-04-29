import Image from "next/image";
import React, { useCallback, useState } from "react";

type ResultFaviconProps = React.ComponentProps<typeof Image> & {
  fallbackUrl?: string;
  numbersOfRetry?: number;
  domain: string
};

const ResultFavicon = ({
  alt,
  fallbackUrl = "/domain_favicons/default.svg",
  numbersOfRetry = 1,
  domain,
  ...props
}: ResultFaviconProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [src, setSrc] = useState(props.src);

  const onError = useCallback(async () => {
    if (retryCount < numbersOfRetry) {
      setRetryCount((count) => count + 1);
      return;
    }

    setSrc(fallbackUrl);
  }, [fallbackUrl, numbersOfRetry, retryCount]);

  return (
    <Image
      key={retryCount.toString()}
      className="rounded-full p-[4px] object-fill"
      width={24}
      height={24}
      alt={alt}
      {...props}
      onError={onError}
      src={src}
      priority
    />
  );
};

export default ResultFavicon;
