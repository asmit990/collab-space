import { withYjs, withYHistory, YjsEditor } from '@slate-yjs/core';
import { useEffect, useMemo, useState } from 'react';
import { createEditor, Editor, Transforms } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';


function CollaborativeEditor({ docId }: { docId: string }) {
    const [isOnline, setInOnline] = useState(false);
    const ydoc  = useMemo(() => new Y.Doc(), []);
    const sharedType = useMemo(() => ydoc.get('content', Y.XmlText), [ydoc]);

    const editor = useMemo(() => {
      const e = withReact(withYHistory(withYjs(createEditor(), sharedType)));
      const { normalizeNode } = e 
      e.normalizeNode = (entry) => {
        const [node] = entry 
        if (!Editor.isEditor(node) || node.children.length > 0) {
           return normalizeNode(entry)
        }
        Transforms.insertNodes(editor, [{ children: [{ text: '' }] }], { at: [0] })
      }
      return e

    }, [sharedType]);

    useEffect(() => {
        const provider = new WebsocketProvider('', 'yjs-ws-demo', ydoc);
        provider.on('status', ({ status }: { status: string }) => 
            setInOnline(status == 'connected')
        )

        YjsEditor.connect(editor);

        return () => {
            YjsEditor.disconnect(editor);
            provider.destroy();
        };
    }, [editor, ydoc]);

    return <div>

        <div style={{ color: isOnline ? 'green' : 'red' }}>
            {isOnline ? 'Connected' : 'Disconnected'}
        </div>

        <Slate
            editor={editor}
            initialValue={[{ children: [{ text: '' }] }]}>
            <Editable
                renderElement={({ attributes, children, element }) => <p {...attributes}>{children}</p>}
                renderLeaf={({ attributes, children, leaf }) => <span {...attributes}>{children}</span>}
                placeholder="Enter some text..."
            />
        </Slate>
    </div>
}

export default CollaborativeEditor;
