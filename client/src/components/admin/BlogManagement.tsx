import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2, Plus } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  published: boolean;
  createdAt: Date;
  publishedAt?: Date | null;
  views?: number;
}

export function BlogManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    metaDescription: "",
    metaKeywords: "",
    published: false,
    publishedAt: new Date(),
  });

  const { data: posts = [], isLoading, refetch } = trpc.blog.getPosts.useQuery();
  const createMutation = trpc.blog.createPost.useMutation();
  const updateMutation = trpc.blog.updatePost.useMutation();
  const deleteMutation = trpc.blog.deletePost.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }

      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        metaDescription: "",
        metaKeywords: "",
        published: false,
        publishedAt: new Date(),
      });
      setEditingId(null);
      setIsCreating(false);
      refetch();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error al guardar el artículo");
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData(post);
    setEditingId(post.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este artículo?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        refetch();
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Error al eliminar el artículo");
      }
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      metaDescription: "",
      metaKeywords: "",
      published: false,
      publishedAt: new Date(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isCreating ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Artículos del Blog</h2>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Artículo
            </Button>
          </div>

          <div className="space-y-3">
            {posts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay artículos publicados. ¡Crea uno para empezar!
              </p>
            ) : (
              posts.map((post: BlogPost) => (
                <Card key={post.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {post.slug}
                        </span>
                        {post.published && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Publicado
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      ) : (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? "Editar Artículo" : "Crear Nuevo Artículo"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <Input
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Título del artículo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL)
              </label>
              <Input
                value={formData.slug || ""}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="titulo-del-articulo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extracto
              </label>
              <Input
                value={formData.excerpt || ""}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Breve descripción del artículo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen Destacada
              </label>
              <ImageUploader
                images={formData.featuredImage ? [{ url: formData.featuredImage, displayOrder: 0, isPrimary: true }] : []}
                onChange={(images) => 
                  setFormData({ ...formData, featuredImage: images.length > 0 ? images[0].url : "" })
                }
                maxImages={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido del Artículo
              </label>
              <RichTextEditor
                value={formData.content || ""}
                onChange={(content) =>
                  setFormData({ ...formData, content })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Descripción (SEO)
              </label>
              <Input
                value={formData.metaDescription || ""}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
                placeholder="Descripción para Google"
                maxLength={160}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Palabras Clave (SEO)
              </label>
              <Input
                value={formData.metaKeywords || ""}
                onChange={(e) =>
                  setFormData({ ...formData, metaKeywords: e.target.value })
                }
                placeholder="palabra1, palabra2, palabra3"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published || false}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
                className="w-4 h-4 text-purple-600 rounded"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Publicar artículo
              </label>
            </div>

            {formData.published && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Publicación
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedAt: new Date(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={
                  createMutation.isPending || updateMutation.isPending
                }
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Artículo"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
