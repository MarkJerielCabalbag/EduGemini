import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";

function CopyFunctionality({ text, setIsCopied, isCopied }) {
  const onCopyText = () => {
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  const onClick = (text) => {
    toast.success(`${text} is copied`);
  };
  return (
    <CopyToClipboard
      text={text}
      options={{ message: "Whoa!" }}
      onCopy={onCopyText}
    >
      <button onClick={() => onClick(text)}>
        {isCopied ? <CopyCheck /> : <Copy />}
      </button>
    </CopyToClipboard>
  );
}

export default CopyFunctionality;
