import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedAt: string;
  author: string;
  views: number;
  metaDescription?: string;
  metaKeywords?: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${slug}`);
        if (!response.ok) throw new Error('Post not found');
        const data = await response.json();
        setPost(data);

        // Fetch related posts
        const relatedResponse = await fetch(`/api/blog/posts/${slug}/related`);
        const relatedData = await relatedResponse.json();
        setRelatedPosts(relatedData);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <button
            onClick={() => navigate('/blog')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Volver al blog
          </button>
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
        title={post.title}
        description={post.metaDescription || post.excerpt}
        image={post.featuredImage}
        url={`https://giftcards.com.co/blog/${post.slug}`}
        type="article"
        schema={schema}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Header */}
          <article>
            {/* Featured Image */}
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg mb-8"
              />
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">{post.author}</span>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <span className="text-sm">{post.views} vistas</span>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none mb-12 text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Call to Action */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Listo para comprar tarjetas de regalo?
              </h3>
              <p className="text-gray-600 mb-4">
                Explora nuestro catálogo completo y encuentra la tarjeta perfecta.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Ver todas las tarjetas
              </button>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Artículos relacionados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <div
                      key={relatedPost.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                    >
                      {relatedPost.featuredImage && (
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </>
  );
}
