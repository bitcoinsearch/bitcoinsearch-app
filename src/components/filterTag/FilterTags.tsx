import useURLManager from "@/service/URLManager/useURLManager";
import { FacetKeys } from "@/types";
import { Button } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ArrowLeft from "../svgs/ArrowLeft";
import ArrowRight from "../svgs/ArrowRight";

type FilterTagProps = {
  field: FacetKeys;
  options: string[] | string;
};

const scrollPadding = 10;

const FilterTags = ({ field, options }: FilterTagProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState({
    page: 0,
    scrollLeft: 0,
  });

  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    // Add data attributes to the container to determine if the left and right arrows should be shown
    const handleArrowVisibility = () => {
      if (!container) return;
      try {
        container.dataset.showLeftArrow = (container.scrollLeft > scrollPadding).toString();
  
        container.dataset.showRightArrow = (
          container.scrollLeft + container.clientWidth + scrollPadding <
          containerRef.current.scrollWidth
        ).toString();
      } catch (e) {
        container.dataset.showLeftArrow = false.toString();
        container.dataset.showRightArrow = false.toString();
      }
    };

    const handleScroll = () => {
      handleArrowVisibility()
    }

    const handleResize = () => {
      if (!container) return;
      handleArrowVisibility()
      try {
        setIsScrollable(container.scrollWidth > container.clientWidth);
      } catch (e) {
        setIsScrollable(false);
      }
    };

    // call handleArrowVisibility and setIsScrollable on mount
    handleArrowVisibility();
    if (container.scrollWidth > container.clientWidth) {
      setIsScrollable(true);
    }

    container.addEventListener("scroll", () => {
      handleScroll();
    });
    window.addEventListener("resize", () => handleResize())

    return () => {
      if (container.scrollWidth > container.clientWidth) {
        container.removeEventListener("scroll", () => handleScroll());
      }
      window.removeEventListener("resize", () => handleScroll())
    };
  }, []);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartX({
      page: event.pageX,
      scrollLeft: containerRef.current.scrollLeft,
    });
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const x = event.pageX;
    const scrollOffset = (x - startX.page) * 2;
    containerRef.current.scrollLeft = startX.scrollLeft - scrollOffset;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleArrowClick = (scrollOffset) => {
    const newScrollLeft = containerRef.current.scrollLeft + scrollOffset;
    containerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth", // Use smooth scrolling behavior
    });
  };

  const { getFilter, addFilter, removeFilter } = useURLManager();

  if (!Array.isArray(options)) return null;

  const onRemove = (value: string) => {
    removeFilter({ filterType: field, filterValue: value });
  };
  const onAdd = (value: string) => {
    addFilter({ filterType: field, filterValue: value });
  };

  const handleToggleFilter = (filter: (typeof formattedOptions)[number]) => {
    if (filter.selected) {
      onRemove(filter.value);
    } else {
      onAdd(filter.value);
    }
  };

  const filterForField = getFilter(field);
  const formattedOptions = options.map((option) => {
    return {
      value: option,
      selected: Boolean(filterForField?.some((el) => el === option)),
    };
  });

  return (
    <div
      className="flex relative overflow-hidden w-full"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        ref={containerRef}
        className={`flex max-w-full gap-2 overflow-auto no-scrollbar peer/facet ${
          isScrollable ? "px-1" : ""
        }`}
      >
        {formattedOptions?.map((a, idx) => (
          <Button
            padding={"auto"}
            bgColor=""
            size="no-size"
            key={`${a.value}_${idx}`}
            className={`leading-none !bg-custom-background !text-custom-primary-text text-[10px] lg:text-[12px] 2xl:text-base rounded-[2px] lg:rounded-lg py-2 px-3 border  items-center justify-center border-custom-stroke ${
              a.selected
                ? "!bg-custom-hover-state !border-custom-accent"
                : "!bg-custom-background"
            }`}
            onClick={() => handleToggleFilter(a)}
            aria-label={`${
              a.selected ? "unselect" : "select"
            } filter ${field}:${a.value}`}
          >
            {a.value}
          </Button>
        ))}
      </div>

      <div
        onClick={() => handleArrowClick(-200)}
        className="hidden peer-data-[show-left-arrow=true]/facet:flex cursor-pointer items-center pl-2 justify-start h-full w-8 bg-shadow-left absolute left-0 top-0"
      >
        <ArrowLeft className="text-black dark:text-custom-primary-text" />
      </div>

      <div
        onClick={() => handleArrowClick(200)}
        className="hidden peer-data-[show-right-arrow=true]/facet:flex cursor-pointer items-center pr-2 justify-end h-full w-8 bg-shadow-right absolute right-0 top-0"
      >
        {" "}
        <ArrowRight className="text-black dark:text-custom-primary-text" />{" "}
      </div>
    </div>
  );
};

export default FilterTags;
