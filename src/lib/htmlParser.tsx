import { marked, RendererObject } from "marked";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";

export const ParseMarkdown = ({content, renderer}:{
    content: string,
    renderer?: RendererObject 
}) =>{
    return parse(DOMPurify.sanitize(
        marked.use({renderer}).parse(content,{async: false})
    ));
}

export const ParseHtml = ({content}:{
    content: string,
}) =>{
    return parse(DOMPurify.sanitize(content))
}