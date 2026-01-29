import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading2 } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkup = (before: string, after: string = "") => {
    const textarea = document.getElementById("richTextArea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    onChange(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: "Negrita",
      action: () => insertMarkup("<strong>", "</strong>"),
    },
    {
      icon: Italic,
      label: "Cursiva",
      action: () => insertMarkup("<em>", "</em>"),
    },
    {
      icon: Heading2,
      label: "Subtítulo",
      action: () => insertMarkup("<h3>", "</h3>"),
    },
    {
      icon: List,
      label: "Lista",
      action: () => insertMarkup("<ul>\n  <li>", "</li>\n</ul>"),
    },
    {
      icon: ListOrdered,
      label: "Lista numerada",
      action: () => insertMarkup("<ol>\n  <li>", "</li>\n</ol>"),
    },
    {
      icon: LinkIcon,
      label: "Enlace",
      action: () => {
        const url = prompt("Ingresa la URL:");
        if (url) insertMarkup(`<a href="${url}" target="_blank">`, "</a>");
      },
    },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex gap-1 flex-wrap items-center">
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.label}
            className="h-8 w-8 p-0"
          >
            <button.icon className="w-4 h-4" />
          </Button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant={!showPreview ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowPreview(false)}
          >
            Editar
          </Button>
          <Button
            type="button"
            variant={showPreview ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowPreview(true)}
          >
            Vista Previa
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3">
        {!showPreview ? (
          <Textarea
            id="richTextArea"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={12}
            className="font-mono text-sm resize-none border-0 focus-visible:ring-0 p-0"
          />
        ) : (
          <div
            className="prose prose-sm max-w-none min-h-[300px] p-2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>

      {/* Helper Text */}
      <div className="bg-gray-50 border-t p-2 text-xs text-gray-600">
        <p className="mb-1"><strong>Etiquetas HTML disponibles:</strong></p>
        <code className="bg-white px-1 py-0.5 rounded text-xs">
          &lt;strong&gt; &lt;em&gt; &lt;h3&gt; &lt;ul&gt; &lt;ol&gt; &lt;li&gt; &lt;a&gt; &lt;p&gt; &lt;br&gt;
        </code>
      </div>
    </div>
  );
}
