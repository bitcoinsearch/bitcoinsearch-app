import { AppItem } from "./AppItem";
import { menuApps } from "./data";

export function AppMenu() {
  return (
    <div className={`bg-custom-background dark:bg-custom-hover-state rounded-2xl border border-custom-stroke w-[min(90vw,300px)] md:w-[402px] max-h-[calc(100vh-70px)] md:max-h-[calc(100vh-100px)] overflow-auto`}>
      <AppItem {...menuApps[0]} />
      <div className="mx-5 md:mx-7 my-3 md:my-3 border border-custom-stroke"></div>
      {menuApps.slice(1).map((item) => (
        <AppItem key={item.title} {...item} />
      ))}
    </div>
  );
}
