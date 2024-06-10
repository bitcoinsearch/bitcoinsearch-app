import bitcoindevs from "public/apps/bitcoin-devs.jpg";
import transcriptsreview from "public/apps/bitcoin-transcripts-review.jpg";
import chatbtc from "public/apps/chat-btc.jpg";
import savingSatoshi from "public/apps/saving-satoshi.jpg";
import bitcointldr from "public/apps/bitcoin-tldr.jpg";
import bitcointranscripts from "public/apps/bitcoin-transcripts.jpg";
import { StaticImageData } from "next/image";

export type MenuApp = {
  href: string;
  image: string | StaticImageData;
  name: string;
  title: string;
};

export const menuApps = [
  {
    href: "https://bitcoindevs.xyz/",
    image: bitcoindevs,
    name: "Bitcoin Devs",
    title:
      "Build the future of money - Study & contribute to bitcoin and lightning open source",
  },
  {
    href: "https://review.btctranscripts.com/",
    image: transcriptsreview,
    name: "Bitcoin Transcripts Review",
    title: "Review technical bitcoin transcripts and earn sats",
  },
  {
    href: "https://chat.bitcoinsearch.xyz",
    image: chatbtc,
    name: "Chat BTC",
    title:
      "Interactive AI chat to learn about bitcoin technology and its history",
  },
  {
    href: "https://savingsatoshi.com",
    image: savingSatoshi,
    name: "Saving Satoshi",
    title:
      "Engaging bitcoin dev intro for coders using technical texts and code challenges",
  },
  {
    href: "https://tldr.bitcoinsearch.xyz/",
    image: bitcointldr,
    name: "Bitcoin TLDR",
    title:
      "Daily summary of key bitcoin tech development discussions and updates",
  },
  {
    href: "https://btctranscripts.com/",
    image: bitcointranscripts,
    name: "Bitcoin Transcripts",
    title:
      "Comprehensive archive of Bitcoin-related transcripts for educational reference",
  },
] satisfies Array<MenuApp>;
