import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Link,
  Code,
  Quote,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Escribe tu contenido aquí (Markdown soportado)",
  rows = 8,
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById(
      "markdown-textarea"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const markdownToHtml = (markdown: string): string => {
    let html = markdown
      // Headers
      .replace(/^### (.*?)$/gm, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
      .replace(/^## (.*?)$/gm, "<h2 class='text-xl font-bold mt-4 mb-2'>$1</h2>")
      .replace(/^# (.*?)$/gm, "<h1 class='text-2xl font-bold mt-4 mb-2'>$1</h1>")
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold'>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
      // Code
      .replace(/`(.*?)`/g, "<code class='bg-gray-200 px-2 py-1 rounded'>$1</code>")
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-blue-600 underline'>$1</a>")
      // Lists
      .replace(/^\* (.*?)$/gm, "<li class='ml-4'>$1</li>")
      // Blockquotes
      .replace(/^> (.*?)$/gm, "<blockquote class='border-l-4 border-gray-300 pl-4 italic'>$1</blockquote>")
      // Line breaks
      .replace(/\n/g, "<br />");

    return html;
  };

  return (
    <div className="space-y-2">
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Editar</TabsTrigger>
          <TabsTrigger value="preview">Vista Previa</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-2">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-100 rounded-t-lg border border-b-0 border-gray-300">
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertMarkdown("**", "**")}
              title="Negrita"
              className="h-8 w-8 p-0"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertMarkdown("*", "*")}
              title="Cursiva"
              className="h-8 w-8 p-0"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <div className="w-px bg-gray-300"></div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertMarkdown("# ")}
              title="Encabezado 1"
              className="h-8 w-8 p-0"
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertMarkdown("## ")}
              title="Encabezado 2"
              className="h-8 w-8 p-0"
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <div className="w-px bg-gray-300"></div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertMarkdown("* ")}
              title="Lista"
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertMarkdown("> ")}
              title="Cita"
              className="h-8 w-8 p-0"
            >
              <Quote className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertMarkdown("`", "`")}
              title="Código"
              className="h-8 w-8 p-0"
            >
              <Code className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertMarkdown("[", "](url)")}
              title="Enlace"
              className="h-8 w-8 p-0"
            >
              <Link className="w-4 h-4" />
            </Button>
          </div>

          {/* Editor */}
          <Textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="font-mono text-sm rounded-b-lg"
          />

          {/* Markdown Help */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Markdown Tips:</strong> **negrita**, *cursiva*, # Encabezado, [enlace](url), `código`
            </p>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="min-h-64 p-4 bg-white border border-gray-300 rounded-lg prose prose-sm max-w-none">
            {value ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: markdownToHtml(value),
                }}
              />
            ) : (
              <p className="text-gray-400">La vista previa aparecerá aquí...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
