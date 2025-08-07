"use client";
import React, { memo, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./Tools";

const Editor = forwardRef(({ data, onChange, editorBlock }, ref) => {
  const editorInstance = useRef();

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (editorInstance.current) {
        return await editorInstance.current.save();
      }
      return null;
    }
  }));

  useEffect(() => {
    if (!editorInstance.current) {
      const editor = new EditorJS({
        holder: editorBlock,
        data: data,
        tools: EDITOR_JS_TOOLS,
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
      });
      editorInstance.current = editor;
    }

    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  return <div id={editorBlock} />;
});

export default memo(Editor);
