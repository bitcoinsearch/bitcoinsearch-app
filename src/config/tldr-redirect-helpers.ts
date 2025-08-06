import { createSlug } from "@/utils";
import { formatFolderDate } from "@/utils/dateUtils";

export const getOnlyDomainPath = (
  domain: string,
  url: string,
  siteName: string,
  date?: Date
) => {
  if (domain === "https://lists.linuxfoundation.org/pipermail/bitcoin-dev/") {
    const domainPath = url.indexOf(domain) + domain.length;
    const onlyDomainPath = url.slice(domainPath).replace(".html", "");
    let title = siteName;
    if (siteName[0] === "[") {
      title = siteName.replace(/[\[]/g, "-");
    }

    title = createSlug(title);
    return `bitcoin-dev/${onlyDomainPath}_${title}/list-linuxfoundation`;
  } else if (domain === "https://mailing-list.bitcoindevs.xyz/bitcoindev/") {
    let folderDate: string | null = formatFolderDate(date);

    let title = siteName;
    if (siteName[0] === "[") {
      title = siteName.replace(/[\[]/g, "-");
    }
    title = createSlug(title);

    const onlyFilePath = url.split(/#/);
    const filePath = onlyFilePath[onlyFilePath.length - 1];

    let urlPath: string;

    if (onlyFilePath && folderDate) {
      urlPath = `bitcoin-dev/${folderDate}/${filePath}_${title}/bitcoin-dev`;
    }

    return urlPath;
  } else if (
    domain === "https://lists.linuxfoundation.org/pipermail/lightning-dev/"
  ) {
    const domainPath = url.indexOf(domain) + domain.length;
    const onlyDomainPath = url.slice(domainPath).replace(".html", "");
    let title = siteName;
    if (siteName[0] === "[") {
      title = siteName.replace(/[\[]/g, "-");
    }
    title = createSlug(title);
    return `lightning-dev/${onlyDomainPath}_${title}/list-linuxfoundation`;
  }
  return "";
};
