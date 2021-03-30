import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

type Props = {
  markdown?: string;
};

const MarkdownComponent = (props: Props) => {
  const { markdown } = props;
  const markdownTest = `
  # Header 1
  ## Header 2

  _italic_

  **bold**

  <b> bold Html </b>
  A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

|a|b|
|-|-|
  `;

  return <ReactMarkdown plugins={[gfm]} source={markdown || markdownTest} />;
};

export default MarkdownComponent;
