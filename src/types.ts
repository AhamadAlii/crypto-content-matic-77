
export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  content: string;
  summary: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface VideoConfig {
  title: string;
  description: string;
  newsArticles: NewsArticle[];
  style: 'professional' | 'casual' | 'dramatic';
  duration: number;
  includeVoiceover: boolean;
  includeBackground: boolean;
  customIntro?: string;
  customOutro?: string;
}

export interface GeneratedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  createdAt: string;
  duration: number;
  hashtags: string[];
  status: 'processing' | 'completed' | 'failed';
  socialPlatforms: {
    twitter: boolean;
    youtube: boolean;
    tiktok: boolean;
    instagram: boolean;
  };
}

export interface SocialPostConfig {
  platformId: 'twitter' | 'youtube' | 'tiktok' | 'instagram';
  scheduledTime?: string;
  caption?: string;
  hashtags?: string[];
  videoId: string;
}

export interface SocialPostResult {
  success: boolean;
  message: string;
  postId?: string;
  postUrl?: string;
}
