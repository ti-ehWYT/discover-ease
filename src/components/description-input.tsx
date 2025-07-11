import { useEffect, useRef } from "react";

type DescriptionInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
      highlightHashtags();
    }
  }, [value]);

  const highlightHashtags = () => {
    const rawText = ref.current?.innerText || "";
    const highlighted = rawText.replace(
      /(#\w+)/g,
      '<span class="text-blue-500">$1</span>'
    );
    if (ref.current) {
      ref.current.innerHTML = highlighted;
      placeCaretAtEnd(ref.current);
    }
  };

  const handleInput = () => {
    const text = ref.current?.innerText || "";
    onChange(text);
    highlightHashtags();
  };

  return (
    <div
      ref={ref}
      contentEditable
      onInput={handleInput}
      className="min-h-[120px] border rounded-md p-2 bg-white focus:outline-none whitespace-pre-wrap"
    />
  );
}

function placeCaretAtEnd(el: HTMLElement) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel?.removeAllRanges();
  sel?.addRange(range);
}