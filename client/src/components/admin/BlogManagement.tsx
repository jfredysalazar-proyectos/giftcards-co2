import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2, Plus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published: boolean;
  publishedAt: string | null;
  views: number;
  metaDescription?: string;
  metaKeywords?: string;
}

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    metaDescription: "",
    metaKeywords: "",
    published: false,
  });

  // Fetch posts
  const { data: fetchedPosts = [] } = trpc.blog.getPosts.useQuery();

  useEffect(() => {
    if (fetchedPosts.length > 0) {
      setPosts(fetchedPosts);
      setLoading(false);
    }
  }, [fetchedPosts]);

  // Mutations
  const createPostMutation = trpc.blog.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post creado exitosamente");
      resetForm();
      // Refetch posts
      trpc.blog.getPosts.useQuery();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updatePostMutation = trpc.blog.updatePost.useMutation({
    onSuccess: () => {
      toast.success("Post actualizado exitosamente");
      resetForm();
      // Refetch posts
      trpc.blog.getPosts.useQuery();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deletePostMutation = trpc.blog.deletePost.useMutation({
    onSuccess: () => {
      toast.success("Post eliminado exitosamente");
      // Refetch posts
      trpc.blog.getPosts.useQuery();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      metaDescription: "",
      metaKeywords: "",
      published: false,
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      metaDescription: post.metaDescription || "",
      metaKeywords: post.metaKeywords || "",
      published: post.published,
    });
    setEditingId(post.id);
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (editingId) {
      updatePostMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este post?")) {
      deletePostMutation.mutate({ id });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? "Editar Post" : "Crear Nuevo Post"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (!editingId) {
                      setFormData((prev) => ({
                        ...prev,
                        slug: generateSlug(e.target.value),
                      }));
                    }
                  }}
                  placeholder="Título del artículo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="titulo-del-articulo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Extracto *</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Breve descripción del artículo (para SEO)"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contenido *</label>
              <MarkdownEditor
                value={formData.content}
                onChange={(content) =>
                  setFormData({ ...formData, content })
                }
                placeholder="Contenido del artículo (Markdown soportado)"
                rows={10}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Descripción (SEO)
                </label>
                <Input
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, metaDescription: e.target.value })
                  }
                  placeholder="Descripción para Google (160 caracteres)"
                  maxLength={160}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Keywords (SEO)
                </label>
                <Input
                  value={formData.metaKeywords}
                  onChange={(e) =>
                    setFormData({ ...formData, metaKeywords: e.target.value })
                  }
                  placeholder="palabras, clave, separadas, por, comas"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">Publicar ahora</span>
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={
                  createPostMutation.isPending || updatePostMutation.isPending
                }
                className="bg-purple-600 hover:bg-purple-700"
              >
                {createPostMutation.isPending || updatePostMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Post"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Create Button */}
      {!isCreating && (
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Nuevo Post
        </Button>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Posts del Blog ({posts.length})</h3>
        {posts.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No hay posts aún. ¡Crea tu primer artículo!
          </Card>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-900">{post.title}</h4>
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          <Eye className="w-3 h-3" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          <EyeOff className="w-3 h-3" />
                          Borrador
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Slug: <code className="bg-gray-100 px-2 py-1 rounded">{post.slug}</code></span>
                      <span>Vistas: {post.views}</span>
                      {post.publishedAt && (
                        <span>
                          Publicado:{" "}
                          {new Date(post.publishedAt).toLocaleDateString("es-CO")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                      disabled={isCreating}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(post.id)}
                      disabled={deletePostMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
