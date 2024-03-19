export type MenuApp = {
  href: string;
  image: string;
  name: string;
  title: string;
};

export const menuApps = [
  {
    href: "/apps/bitcoin-devs.jpg",
    image: "/apps/bitcoin-devs.jpg",
    name: "Bitcoin Devs",
    title:
      "Build the future of money - Study & contribute to bitcoin and lightning open source",
  },
  {
    href: "/apps/bitcoin-transcripts-review.jpg",
    image: "/apps/bitcoin-transcripts-review.jpg",
    name: "Bitcoin Transcripts Review",
    title: "Review technical bitcoin transcripts and earn sats",
  },
  {
    href: "/apps/chat-btc.jpg",
    image: "/apps/chat-btc.jpg",
    name: "Chat BTC",
    title:
      "Interactive AI chat to learn about bitcoin technology and its history",
  },
  {
    href: "/apps/saving-satoshi.jpg",
    image: "/apps/saving-satoshi.jpg",
    name: "Saving Satoshi",
    title:
      "Engaging bitcoin dev intro for coders using technical texts and code challenges",
  },
  {
    href: "/apps/bitcoin-tldr.jpg",
    image: "/apps/bitcoin-tldr.jpg",
    name: "Bitcoin TLDR",
    title:
      "Daily summary of key bitcoin tech development discussions and updates",
  },
  {
    href: "/apps/bitcoin-transcripts.jpg",
    image: "/apps/bitcoin-transcripts.jpg",
    name: "Bitcoin Transcripts",
    title:
      "Comprehensive archive of Bitcoin-related transcripts for educational reference",
  },
  {
    href: "/apps/bitcoin-search.jpg",
    image: "/apps/bitcoin-search.jpg",
    name: "Bitcoin Transcripts Search",
    title: "Better google for bitcoin tech-related information and resources",
  },
] satisfies Array<MenuApp>;
