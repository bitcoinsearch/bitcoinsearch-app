export const getOnlyDomainPath = (
  domain: string,
  url: string,
  siteName: string
) => {
  if (domain === "https://lists.linuxfoundation.org/pipermail/bitcoin-dev/") {
    const domainPath = url.indexOf(domain) + domain.length;
    const onlyDomainPath = url.slice(domainPath).replace(".html", "");
    let title = siteName;
    if (siteName[0] === "[") {
      title = siteName.replace(/[\[]/g, "-");
    }
    title = title.replace(/ /g, "-").replace(/[\]]/g, "").replace(/[_?]/g, "-");

    return `${domain}${onlyDomainPath}_${title}`;
  }
  return "";
};
