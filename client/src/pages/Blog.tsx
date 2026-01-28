import { Link, useLocation } from 'wouter';
import SEO from '../components/SEO';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import Footer from '../components/Footer';

// Cache bust: Tue Jan 28 16:30:00 EST 2026
export default function Blog() {
  const [, setLocation] = useLocation();
  const { data: posts, isLoading: loading } = trpc.blog.getPosts.useQuery();

  return (
    <>
      <SEO
        title="Blog de Tarjetas de Regalo | GiftCards.com.co"
        description="Lee nuestros artículos sobre cómo comprar tarjetas de regalo digitales en Colombia, guías de PSN, Xbox, Amazon y más."
        url="https://giftcards.com.co/blog"
        keywords="blog tarjetas regalo, guías gift cards, tutoriales PSN, amazon gift card"
      />
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-12 flex-grow">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blog de Tarjetas de Regalo
            </h1>
            <p className="text-xl text-gray-600">
              Guías, tutoriales y consejos para comprar tarjetas digitales en Colombia
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!loading && posts && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col h-full group"
                  >
                    {/* Featured Image */}
                    <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-700">{post.author}</span>
                        </div>
                        <span>
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-CO', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Borrador'}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Call to Action Section */}
          {!loading && posts && posts.length > 0 && (
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
          )}

          {/* Empty State */}
          {!loading && (!posts || posts.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No hay artículos disponibles en este momento.
              </p>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
