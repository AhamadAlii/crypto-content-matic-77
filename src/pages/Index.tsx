
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Newspaper, 
  RefreshCw, 
  ChevronRight, 
  Video, 
  Share,
  Search,
  TrendingUp
} from 'lucide-react';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import VideoGenerator from '@/components/VideoGenerator';
import SocialPoster from '@/components/SocialPoster';
import { NewsArticle, GeneratedVideo } from '@/types';
import { fetchCryptoNews } from '@/utils/newsService';

const Index = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticles, setSelectedArticles] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('news');
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);

  useEffect(() => {
    loadNewsArticles();
  }, []);

  const loadNewsArticles = async () => {
    setIsLoading(true);
    try {
      const articles = await fetchCryptoNews();
      setNewsArticles(articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error fetching news",
        description: "Could not load the latest crypto news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleArticleSelect = (article: NewsArticle) => {
    if (selectedArticles.find(a => a.id === article.id)) {
      setSelectedArticles(selectedArticles.filter(a => a.id !== article.id));
    } else {
      setSelectedArticles([...selectedArticles, article]);
    }
  };

  const filteredArticles = searchTerm 
    ? newsArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : newsArticles;

  const handleVideoGenerated = (video: GeneratedVideo) => {
    setGeneratedVideo(video);
    setCurrentTab('share');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground min-h-screen relative overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 bg-grain opacity-[0.03] pointer-events-none z-0"></div>
        <div className="fixed top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-radial from-gray-100/50 to-transparent dark:from-gray-900/30 dark:to-transparent opacity-70 pointer-events-none z-0"></div>
        
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        
        <main className="container pt-24 pb-12 px-4 md:px-8 relative z-10">
          <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-gradient mb-4">
                Crypto Content<span className="font-light">Matic</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Automatically generate engaging crypto news videos using AI and share them across your social media
              </p>
            </div>
            
            <Tabs 
              defaultValue="news" 
              value={currentTab}
              onValueChange={setCurrentTab}
              className="mb-6 w-full"
            >
              <div className="flex justify-center">
                <TabsList className="glass-card">
                  <TabsTrigger value="news" className="flex items-center gap-2 px-4">
                    <Newspaper className="h-4 w-4" />
                    <span className="hidden md:inline">News Feed</span>
                  </TabsTrigger>
                  <TabsTrigger value="create" className="flex items-center gap-2 px-4">
                    <Video className="h-4 w-4" />
                    <span className="hidden md:inline">Create Video</span>
                  </TabsTrigger>
                  <TabsTrigger value="share" className="flex items-center gap-2 px-4" disabled={!generatedVideo}>
                    <Share className="h-4 w-4" />
                    <span className="hidden md:inline">Share</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="news" className="animate-fade-in mt-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold">Latest Crypto News</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={loadNewsArticles}
                      disabled={isLoading}
                      className="glass-card"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search news..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 glass-input"
                      />
                    </div>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-80 rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArticles.map((article) => (
                        <NewsCard 
                          key={article.id} 
                          article={article} 
                          onSelect={handleArticleSelect}
                          isSelected={selectedArticles.some(a => a.id === article.id)}
                        />
                      ))}
                    </div>
                    
                    {filteredArticles.length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">No news articles matching your search.</p>
                      </div>
                    )}
                  </>
                )}
                
                {selectedArticles.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Button 
                      onClick={() => setCurrentTab('create')}
                      className="glass-card hover:bg-primary/10 dark:hover:bg-primary/20 text-primary hover:text-primary/80 font-medium transition-all duration-300"
                    >
                      Continue to Video Creator
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="create" className="animate-fade-in mt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Video className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Create Crypto News Video</h2>
                </div>
                
                <div className="max-w-3xl mx-auto">
                  <VideoGenerator 
                    selectedArticles={selectedArticles}
                    onVideoGenerated={handleVideoGenerated}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="share" className="animate-fade-in mt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Share className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Share Your Crypto Video</h2>
                </div>
                
                {generatedVideo ? (
                  <div className="max-w-3xl mx-auto">
                    <SocialPoster video={generatedVideo} />
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">You need to generate a video first.</p>
                    <Button 
                      onClick={() => setCurrentTab('create')}
                      className="mt-4"
                    >
                      Go to Video Creator
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
