function getNewClassName(newClassName: string | string[]) {
  if (!Array.isArray(newClassName)) return newClassName;

  return newClassName.filter((name) => name).join(" ");
}

export default function appendClassName(
  baseClassName?: string | string[] | undefined,
  newClassName?: string | string[] | undefined
): string {
  if (!newClassName)
    return (
      (Array.isArray(baseClassName)
        ? baseClassName.join(" ")
        : baseClassName) || ""
    );
  if (!baseClassName) return getNewClassName(newClassName) || "";
  return `${baseClassName} ${getNewClassName(newClassName)}`;
}

// To remove the weird character "�" and markdowns /n
export const removeMarkdownCharacters = (value:string)=>{
  return value.replace(/(\\n|[.]+)/gm, " ").replace(/[^\x20-\x7E]/g, "'")
}