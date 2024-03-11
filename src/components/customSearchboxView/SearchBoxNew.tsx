import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "../svgs/SearchIcon";
import { defaultSearchTags } from "@/utils/dummy";
import CloseIconOutlined from "../svgs/CloseIconOutlined";

const SearchBoxNew = () => {
  const inputRef = useRef<HTMLInputElement | null>();
  const [typed, setTyped] = useState(false)
  const [onFocus, setFocus] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const [isOutsideClick, setIsOutsideClick] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBoxRef.current &&
      !searchBoxRef.current.contains(event.target as Node)
    ) {
      setIsOutsideClick(true);
    } else {
      setIsOutsideClick(false);
    }
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      handleClickOutside(event);
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const onTabClick = (value: string) => {
    inputRef.current.value = value;
    setTyped(false)
  };
  return (
    <>
      <div
        ref={searchBoxRef}
        tabIndex={0}
        className="flex  items-start w-full mx-auto max-w-3xl"
      >
        <div className="flex-col w-full">
          <div
            className={`${
              onFocus && !isOutsideClick
                ? "rounded-b-none rounded-tl-2xl"
                : "rounded-l-2xl"
            } border-r-0  h-full  w-full px-6 items-center border border-light_gray flex`}
          >
            <input
              ref={inputRef}
              onKeyUp={(e)=>setTyped(true)}
              onFocus={() => {
                setFocus(true);
              }}
              placeholder="Search for topics, authors or resources..."
              className="h-full placeholder:text-light_gray w-full border-none outline-none bg-transparent py-3"
            />
            {!(onFocus && !isOutsideClick && typed) && (
              <p className="whitespace-nowrap text-sm text-light_gray">
                {" "}
                Ctrl + K
              </p>
            )}
            {
             typed && <CloseIconOutlined />
            }
          </div>
{/* dropdown showing tags onl */}
          {onFocus && !isOutsideClick && (
            <div
              className={`border border-t-0 border-light_gray z-20 px-6 py-7 w-full max-w-3xl max- min-h-[367px]  bg-white rounded-b-2xl gap-8 flex flex-col `}
            >
              {/* Each search */}
              {defaultSearchTags.map((tagType) => (
                <div
                  key={tagType.headline}
                  className="flex text-dark flex-col gap-2"
                >
                  <p className=" font-semibold">{tagType.headline}</p>
                  <div className="flex flex-wrap gap-2">
                    {tagType.tags.map((tag) => (
                      <div
                        key={tag}
                        onClick={() => onTabClick(tag)}
                        className="py-2 hover:bg-[#FFF0E0] cursor-pointer text-xs rounded-lg border border-light_gray  px-4 max-w-[max-content]"
                      >
                        <p>{tag}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center bg-gradient-search h-[45px] px-4 min-h-full rounded-r-2xl">
          <SearchIcon />
        </div>
      </div>
    </>
  );
};

export default SearchBoxNew;
