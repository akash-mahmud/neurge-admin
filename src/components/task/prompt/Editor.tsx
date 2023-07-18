import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const Editor = () => {
    const [value, setValue] = useState("**Hello world!!!**");

return (
    <MDEditor   value="Hello Markdown!"
    onChange={(val) => {
      setValue(val as string);
    }}/>
)
}

export default Editor