import React from "react";
import { useSlate } from "slate-react";
import { Editor, Transforms, Text } from "slate";
import { HistoryEditor } from "slate-history";
import {  Element as SlateElement } from "slate";
const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Array.from(
        Editor.nodes(editor, {
            match: n => 
                !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === format,

        })

    )
    return !!match;
}
const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(editor, format);
    const newType = isActive ? "patagraph" : format;
    Transforms.setNodes(editor, { type: newType } as Partial<SlateElement>);
}
const ToolbarButton = ({
  format,
  icon,
}: {
  format: string;
  icon: string;
}) => {

  const editor = useSlate() as HistoryEditor;
  const isActive = (editor: Editor, format: string) => {
    const [match] = Array.from(
      Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && Text.isText(n) && (n as any)[format] === true,
        universal: true,
      })
    );
    return !!match;
  };

  const toggleMark = (editor: Editor, format: string) => {
    const active = isActive(editor, format);
    if (active) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  return (
    <button
      className={`px-2 py-1 border rounded ${
        isActive(editor, format) ? "bg-gray-300" : "bg-white"
      }`}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </button>
  );
};

const ToolBar = () => {
  const editor = useSlate() as HistoryEditor; 

 return (
    <div className="flex gap-2 p-2 border-b bg-gray-50">
      {/* Marks */}
      <ToolbarButton format="bold" icon="B" />
      <ToolbarButton format="italic" icon="I" />
      <ToolbarButton format="underline" icon="U" />

      {/* Blocks */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, "heading-one");
        }}
        className="px-2 py-1 border rounded bg-white hover:bg-gray-200"
      >
        H1
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, "heading-two");
        }}
        className="px-2 py-1 border rounded bg-white hover:bg-gray-200"
      >
        H2
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, "block-quote");
        }}
        className="px-2 py-1 border rounded bg-white hover:bg-gray-200"
      >
        ❝
      </button>

      {/* Undo / Redo */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          HistoryEditor.undo(editor);
        }}
        className="px-2 py-1 border rounded bg-white hover:bg-gray-200"
      >
        ↶
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          HistoryEditor.redo(editor);
        }}
        className="px-2 py-1 border rounded bg-white hover:bg-gray-200"
      >
        ↷
      </button>
    </div>
  );
};

export default ToolBar;
