import { AppItem } from "./AppItem";
import { menuApps } from "./data";

export function AppMenu() {
  return (
    <div className="ml-10 mb-[1000px] py-5 rounded-2xl border border-[#BFBFBF] w-[402px]">
      <AppItem {...menuApps[0]} />
      <div className="mx-7 my-3 border border-[#BFBFBF]"></div>
      {menuApps.slice(1).map((item) => (
        <AppItem key={item.title} {...item} />
      ))}
    </div>
  );
}
