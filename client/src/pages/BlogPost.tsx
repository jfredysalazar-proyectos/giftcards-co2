import { useParams, useLocation } from 'wouter';
import { useEffect } from 'react';
import SEO from '../components/SEO';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, User, Eye } from 'lucide-react';
import Footer from '../components/Footer';

export default function BlogPost() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();

  const { data: post, isLoading: loading, error } = trpc.blog.getPostBySlug.useQuery(
    { slug: slug || '' },
    { enabled: !!slug }
  );
  
  const incrementViewsMutation = trpc.blog.incrementViews.useMutation();
  const { data: relatedPosts = [] } = trpc.blog.getRandomPosts.useQuery(
    { limit: 4, excludeId: post?.id },
    { enabled: !!post?.id }
  );
  
  // Incrementar visitas cuando se carga el artículo
  useEffect(() => {
    if (post?.id && !loading) {
      incrementViewsMutation.mutate({ id: post.id });
    }
  }, [post?.id, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
          <div className="text-purple-600 mb-4 flex justify-center">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Artículo no encontrado</h1>
          <p className="text-gray-600 mb-6">Lo sentimos, el artículo que buscas no existe o ha sido movido.</p>
          <Button
            onClick={() => setLocation('/blog')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            Volver al blog
          </Button>
        </div>
      </div>
    );
  }

  // Schema.org for Blog Post
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    articleBody: post.content,
  };

  return (
    <>
      <SEO
        title={`${post.title} | Blog GiftCards.com.co`}
        description={post.metaDescription || post.excerpt}
        image={post.featuredImage || undefined}
        url={`https://giftcards.com.co/blog/${post.slug}`}
        type="article"
        schema={schema}
      />

      <div className="min-h-screen flex flex-col bg-white">
        {/* Navigation Bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
            <button
              onClick={() => setLocation('/blog')}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors font-medium group"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
              Volver al Blog
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex-grow">
          <article>
            {/* Header Section */}
            <header className="mb-10 text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-gray-500 text-sm md:text-base">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-purple-500" />
                  <span className="font-medium text-gray-700">{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                  <span>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'Borrador'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-purple-500" />
                  <span>{(post.views || 0) + 1} vistas</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-12 rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            )}

            {/* Content Body */}
            <div
              className="prose prose-lg md:prose-xl max-w-none mb-16 text-gray-800 
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:leading-relaxed prose-p:mb-6
                prose-img:rounded-xl prose-img:shadow-md
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {/* Related Articles Carousel */}
            {relatedPosts.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Más Artículos del Blog</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedPosts.map((article: any) => (
                    <div
                      key={article.id}
                      onClick={() => setLocation(`/blog/${article.slug}`)}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 border border-gray-200"
                    >
                      {article.featuredImage && (
                        <div className="h-40 overflow-hidden bg-gray-200">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                          <Eye className="w-3 h-3" />
                          <span>{article.views || 0} vistas</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Call to Action */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white text-center shadow-lg mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                ¿Buscas las mejores tarjetas de regalo?
              </h3>
              <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
                En GiftCards.com.co tenemos el catálogo más completo de Colombia con entrega inmediata y pagos seguros.
              </p>
              <Button
                onClick={() => setLocation('/')}
                className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-6 px-10 rounded-xl text-lg transition-all transform hover:scale-105"
              >
                Explorar Catálogo Ahora
              </Button>
            </div>
          </article>
        </div>
        <Footer />
      </div>
    </>
  );
}
