
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, ThumbsUp, ThumbsDown, Shuffle } from 'lucide-react';
import { NewsArticle } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  article: NewsArticle;
  onSelect: (article: NewsArticle) => void;
  isSelected: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onSelect, isSelected }) => {
  const getSentimentIcon = () => {
    switch (article.sentiment) {
      case 'positive':
        return <ThumbsUp size={14} className="text-green-500" />;
      case 'negative':
        return <ThumbsDown size={14} className="text-red-500" />;
      default:
        return <Shuffle size={14} className="text-yellow-500" />;
    }
  };

  const getSentimentColor = () => {
    switch (article.sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  return (
    <Card className={`hover-scale transition-all duration-300 ${isSelected ? 'ring-2 ring-primary/50' : ''} glass-card overflow-hidden`}>
      <div className="relative h-40 overflow-hidden">
        <img 
          src={article.imageUrl || 'https://via.placeholder.com/300x150?text=Crypto+News'} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Badge className="absolute top-3 left-3 bg-white/90 text-black dark:bg-white/90 dark:text-black">
          {article.source}
        </Badge>
        <div className="absolute bottom-3 left-3 flex items-center space-x-1">
          <Calendar size={14} className="text-white" />
          <span className="text-xs text-white">{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium line-clamp-2">{article.title}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2 mt-1">{article.summary}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`flex items-center gap-1 px-2 ${getSentimentColor()}`}>
            {getSentimentIcon()}
            <span className="capitalize">{article.sentiment}</span>
          </Badge>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink size={12} className="mr-1" /> Source
          </a>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onSelect(article)} 
          variant={isSelected ? "default" : "outline"} 
          className="w-full"
        >
          {isSelected ? 'Selected' : 'Select for Video'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
