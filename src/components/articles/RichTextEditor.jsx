import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { uploadImageToCloudinary } from "../../lib/cloudinary";
import ImageCropModal from "./ImageCropModal";

const ToolbarButton = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed ${
      active
        ? "bg-[#FF0000] text-white"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
    }`}
  >
    {children}
  </button>
);

export default function RichTextEditor({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Write the full article content here…",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
    e.target.value = "";
  }, []);

  const handleCropCancel = useCallback(() => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }, [cropSrc]);

  const handleCropConfirm = useCallback(
    async (blob) => {
      if (cropSrc) URL.revokeObjectURL(cropSrc);
      setCropSrc(null);
      if (!editor) return;
      try {
        setUploading(true);
        const url = await uploadImageToCloudinary(blob);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error("Image upload failed", err);
      } finally {
        setUploading(false);
      }
    },
    [editor, cropSrc]
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 bg-white flex-wrap">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={15} />
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          title="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered List"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={15} />
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton title="Link" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Insert Image"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={15} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          title="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo size={15} />
        </ToolbarButton>

        {uploading && (
          <span className="text-xs text-gray-400 ml-2">Uploading image…</span>
        )}
      </div>

      {/* Editor body */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 min-h-[280px] max-h-[480px] overflow-y-auto focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[260px] [&_img]:rounded-xl [&_img]:my-3"
      />
    </div>
  );
}
