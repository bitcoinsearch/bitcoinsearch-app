import { useTheme } from "@/context/Theme";
import Image from "next/image";
import React, { useCallback, useState } from "react";

type ResultFaviconProps = React.ComponentProps<typeof Image> & {
  fallbackUrl?: string;
  numbersOfRetry?: number;
  domain: string
  isDark: boolean;
};

const ResultFavicon = ({
  alt,
  fallbackUrl,
  numbersOfRetry = 1,
  domain,
  isDark,
  ...props
}: ResultFaviconProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [src, setSrc] = useState(props.src);

  const onError = useCallback(async () => {
    if (retryCount < numbersOfRetry) {
      setRetryCount((count) => count + 1);
      return;
    }
    const defaultFallback = isDark? "/domain_favicons/default_dark.png" : "/domain_favicons/default_light.png"
    setSrc(fallbackUrl ?? defaultFallback);
  }, [fallbackUrl, numbersOfRetry, retryCount]);

  return (
    <Image
      key={retryCount.toString()}
      className="object-fit"
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
