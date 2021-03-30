import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

type Props = {
  markdown: string;
  classname?: string;
};

const MarkdownComponent = (props: Props): JSX.Element => {
  const { markdown, classname } = props;
  return (
    <ReactMarkdown
      className={classname || ""}
      plugins={[gfm]}
      source={markdown}
    />
  );
};

export default MarkdownComponent;
