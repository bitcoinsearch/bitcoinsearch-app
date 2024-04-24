export type MenuApp = {
  href: string;
  image: string;
  name: string;
  title: string;
};

export const menuApps = [
  {
    href: "https://bitcoindevs.xyz/",
    image: "/apps/bitcoin-devs.jpg",
    name: "Bitcoin Devs",
    title:
      "Build the future of money - Study & contribute to bitcoin and lightning open source",
  },
  {
    href: "https://review.btctranscripts.com/",
    image: "/apps/bitcoin-transcripts-review.jpg",
    name: "Bitcoin Transcripts Review",
    title: "Review technical bitcoin transcripts and earn sats",
  },
  {
    href: "https://chat.bitcoinsearch.xyz",
    image: "/apps/chat-btc.jpg",
    name: "Chat BTC",
    title:
      "Interactive AI chat to learn about bitcoin technology and its history",
  },
  {
    href: "https://savingsatoshi.com",
    image: "/apps/saving-satoshi.jpg",
    name: "Saving Satoshi",
    title:
      "Engaging bitcoin dev intro for coders using technical texts and code challenges",
  },
  {
    href: "https://tldr.bitcoinsearch.xyz/",
    image: "/apps/bitcoin-tldr.jpg",
    name: "Bitcoin TLDR",
    title:
      "Daily summary of key bitcoin tech development discussions and updates",
  },
  {
    href: "https://btctranscripts.com/",
    image: "/apps/bitcoin-transcripts.jpg",
    name: "Bitcoin Transcripts",
    title:
      "Comprehensive archive of Bitcoin-related transcripts for educational reference",
  },
] satisfies Array<MenuApp>;
