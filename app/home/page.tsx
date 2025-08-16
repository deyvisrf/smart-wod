'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import WorkoutPost from '@/components/WorkoutPost';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FeedService, LikeService, CommentService, FollowService, type WodWithSocial, type Comment } from '@/lib/social';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // Estados para o feed
  const [feedPosts, setFeedPosts] = React.useState<WodWithSocial[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = React.useState(true);
  const [expandedIds, setExpandedIds] = React.useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = React.useState<Record<string, boolean>>({});
  const [commentTexts, setCommentTexts] = React.useState<Record<string, string>>({});
  const [postComments, setPostComments] = React.useState<Record<string, Comment[]>>({});
  const [loadingActions, setLoadingActions] = React.useState<Record<string, boolean>>({});

  // Redirect para login se não autenticado
  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading, router]);

  // Carrega o feed do usuário
  const loadFeed = async () => {
    if (!user) return;
    
    setIsLoadingFeed(true);
    try {
      const feed = await FeedService.getUserFeed(user.id);
      setFeedPosts(feed);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  // Carrega comentários de um post
  const loadComments = async (wodId: string) => {
    try {
      const comments = await CommentService.getWodComments(wodId);
      setPostComments(prev => ({ ...prev, [wodId]: comments }));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  React.useEffect(() => {
    if (user) {
      loadFeed();
    }
  }, [user]);

  // Função para lidar com likes
  const handleLike = async (wodId: string) => {
    if (!user || loadingActions[wodId]) return;
    
    setLoadingActions(prev => ({ ...prev, [wodId]: true }));
    try {
      const result = await LikeService.toggleLike(wodId, user.id);
      
      // Atualizar estado local
      setFeedPosts(prev => prev.map(post => 
        post.id === wodId 
          ? { ...post, is_liked: result.liked, likes_count: result.count }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoadingActions(prev => ({ ...prev, [wodId]: false }));
    }
  };

  // Função para adicionar comentário
  const handleAddComment = async (wodId: string) => {
    if (!user || !commentTexts[wodId]?.trim()) return;
    
    try {
      const comment = await CommentService.addComment(wodId, user.id, commentTexts[wodId]);
      if (comment) {
        // Atualizar comentários locais
        setPostComments(prev => ({
          ...prev,
          [wodId]: [...(prev[wodId] || []), comment]
        }));
        
        // Limpar texto do comentário
        setCommentTexts(prev => ({ ...prev, [wodId]: '' }));
        
        // Atualizar count de comentários
        setFeedPosts(prev => prev.map(post => 
          post.id === wodId 
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Função para mostrar/esconder comentários
  const handleToggleComments = async (wodId: string) => {
    const isShowing = showComments[wodId];
    setShowComments(prev => ({ ...prev, [wodId]: !isShowing }));
    
    // Se está mostrando pela primeira vez, carregar comentários
    if (!isShowing && !postComments[wodId]) {
      await loadComments(wodId);
    }
  };
  // Loading state
  if (loading || isLoadingFeed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Sidebar />
        <Header />
        <main className="lg:ml-72 pt-20 lg:pt-24 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando feed...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 pt-20 lg:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            <div className="xl:col-span-2 order-2 xl:order-1">
              {feedPosts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-dumbbell-line text-3xl text-purple-500"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Bem-vindo ao SmartWod! 🎉</h3>
                  <p className="text-gray-600 mb-6">
                    Sua aplicação está funcionando perfeitamente! Como é nova, ainda não há WODs publicados.
                  </p>
                  
                  {/* Botões de ação */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => router.push('/create')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Criar Primeiro WOD
                    </button>
                    
                    <button
                      onClick={() => router.push('/wods')}
                      className="bg-white border-2 border-purple-500 text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all"
                    >
                      <i className="ri-search-line mr-2"></i>
                      Explorar WODs
                    </button>
                  </div>
                  
                  {/* Informações adicionais */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-3">
                      💡 Dicas para começar:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <i className="ri-check-line text-green-500"></i>
                        <span>Crie seu primeiro treino</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="ri-check-line text-green-500"></i>
                        <span>Siga outros usuários</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="ri-check-line text-green-500"></i>
                        <span>Compartilhe seus WODs</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                feedPosts.map((post) => {
                const key = post.id;
                const showPostComments = !!showComments[key];
                const commentText = commentTexts[key] || '';
                const comments = postComments[key] || [];
                const isActionLoading = !!loadingActions[key];

                return (
                <div key={post.id} className="mb-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    {/* Header do post */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          {post.user.avatar_url ? (
                            <img src={post.user.avatar_url} alt={post.user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-white font-bold text-base lg:text-lg">
                              {post.user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{post.user.name}</h3>
                          <p className="text-xs lg:text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-purple-100 text-purple-700">
                        WOD
                      </span>
                    </div>

                    {/* Título do WOD */}
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">{post.title}</h2>
                    
                    {/* Placeholder para conteúdo do WOD */}
                    <div className="text-gray-600 text-sm mb-4">
                      <p>Detalhes do treino disponíveis na página do WOD.</p>
                    </div>

                    {/* Ações sociais */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-4">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <button 
                          onClick={() => handleLike(post.id)}
                          disabled={isActionLoading}
                          className={`flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
                            post.is_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          } disabled:opacity-50`}
                        >
                          <i className={`${post.is_liked ? 'ri-heart-fill' : 'ri-heart-line'} text-lg lg:text-xl`}></i>
                          <span className="font-medium text-sm lg:text-base">{post.likes_count}</span>
                        </button>
                        
                        <button 
                          onClick={() => handleToggleComments(post.id)}
                          className="flex items-center gap-2 text-gray-500 hover:text-purple-500 cursor-pointer whitespace-nowrap transition-colors"
                        >
                          <i className="ri-chat-3-line text-lg lg:text-xl"></i>
                          <span className="font-medium text-sm lg:text-base">{post.comments_count}</span>
                        </button>
                        
                        <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 cursor-pointer whitespace-nowrap transition-colors">
                          <i className="ri-share-line text-lg lg:text-xl"></i>
                          <span className="font-medium text-sm lg:text-base hidden sm:inline">Compartilhar</span>
                        </button>
                      </div>
                    </div>

                    {/* Seção de comentários */}
                    {showPostComments && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="space-y-3">
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-3">
                              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                {comment.user?.avatar_url ? (
                                  <img src={comment.user.avatar_url} alt={comment.user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  <span className="text-white text-xs lg:text-sm font-bold">
                                    {comment.user?.name.charAt(0).toUpperCase() || 'U'}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-semibold">{comment.user?.name || 'Usuário'}</span> {comment.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Input para novo comentário */}
                        <div className="flex items-center gap-3 mt-4">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs lg:text-sm font-bold">
                              {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <input 
                            type="text" 
                            placeholder="Escreva um comentário..." 
                            value={commentText}
                            onChange={(e) => setCommentTexts(prev => ({ ...prev, [key]: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            className="flex-1 px-3 lg:px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-gray-50"
                          />
                          <button 
                            onClick={() => handleAddComment(post.id)}
                            className="text-purple-500 hover:text-purple-600 cursor-pointer p-2 hover:bg-purple-50 rounded-full transition-colors"
                          >
                            <i className="ri-send-plane-line text-lg lg:text-xl"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
                })
              )}
            </div>

            <div className="space-y-4 lg:space-y-6 order-1 xl:order-2">
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Descobrir</h3>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-user-add-line text-2xl text-purple-500"></i>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Sistema de sugestões em desenvolvimento
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hidden lg:block">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Estatísticas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">WODs salvos</span>
                    <span className="font-semibold text-purple-600">-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Seguidores</span>
                    <span className="font-semibold text-purple-600">-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Seguindo</span>
                    <span className="font-semibold text-purple-600">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}






