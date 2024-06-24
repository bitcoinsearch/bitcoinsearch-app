const gnusha = "https://gnusha.org/pi/bitcoindev/";
const newBitcoinDevMailingList =
  "https://mailing-list.bitcoindevs.xyz/bitcoindev/";

export const remapUrl = ({ url, domain }: { url: string; domain: string }) => {
  switch (domain) {
    case newBitcoinDevMailingList:
      if (url.includes(gnusha)) {
        return url.replaceAll(gnusha, newBitcoinDevMailingList);
      }
      return url;

    case gnusha:
      if (url.includes(gnusha)) {
        return url.replaceAll(gnusha, newBitcoinDevMailingList);
      }
      return url;

    default:
      return url;
  }
};
