import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Quote, 
  AlignLeft, AlignCenter, AlignRight, 
  Image as ImageIcon, Link as LinkIcon,
  Heading1, Heading2, Heading3,
  Undo, Redo, Code
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Escribe el contenido aquí...' }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadMutation = trpc.upload.uploadImage.useMutation();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-md max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-600 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-purple max-w-none min-h-[300px] p-4 focus:outline-none border rounded-b-lg bg-white',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const result = await uploadMutation.mutateAsync({
            imageData: base64,
            folder: 'giftcards/blog',
            filename: file.name.split('.')[0],
          });
          
          editor.chain().focus().setImage({ src: result.url }).run();
          toast.success('Imagen subida correctamente');
        };
      } catch (error: any) {
        toast.error('Error al subir imagen: ' + error.message);
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const MenuButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant={isActive ? 'secondary' : 'ghost'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`h-8 w-8 p-0 ${isActive ? 'bg-purple-100 text-purple-700' : ''}`}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div className="flex flex-col w-full border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Negrita"
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Cursiva"
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Subrayado"
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Código"
        >
          <Code className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Título 1"
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Título 2"
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Título 3"
        >
          <Heading3 className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Lista de viñetas"
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Cita"
        >
          <Quote className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Alinear a la izquierda"
        >
          <AlignLeft className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Centrar"
        >
          <AlignCenter className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Alinear a la derecha"
        >
          <AlignRight className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Insertar enlace">
          <LinkIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={addImage} disabled={isUploading} title="Insertar imagen">
          <ImageIcon className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer"
        >
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer"
        >
          <Redo className="w-4 h-4" />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
