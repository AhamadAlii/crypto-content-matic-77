
import { VideoConfig, GeneratedVideo, NewsArticle } from '@/types';

// Function to extract key points from news articles
const extractKeyPoints = (articles: NewsArticle[]): string[] => {
  const keyPoints: string[] = [];
  
  articles.forEach(article => {
    // Add article title as a key point
    keyPoints.push(article.title);
    
    // Add article summary as a key point
    if (article.summary) {
      keyPoints.push(article.summary);
    }
    
    // Extract sentences from content (simple approach)
    const sentences = article.content
      .split('.')
      .filter(sentence => sentence.trim().length > 30)
      .slice(0, 2);
    
    keyPoints.push(...sentences);
  });
  
  // Limit to a reasonable number of key points
  return keyPoints.slice(0, 10).map(point => point.trim());
};

// Function to generate video segments based on news articles
const generateVideoSegments = (articles: NewsArticle[], duration: number): any[] => {
  // Calculate approximate time per article
  const timePerArticle = Math.max(15, Math.floor(duration / (articles.length || 1)));
  
  return articles.map((article, index) => {
    return {
      type: 'news_segment',
      title: article.title,
      imageUrl: article.imageUrl,
      content: article.summary || article.content.substring(0, 100),
      duration: timePerArticle,
      order: index
    };
  });
};

// Function to generate a video from news articles
export const generateVideo = async (config: VideoConfig): Promise<GeneratedVideo> => {
  // In a real application, this would call a video generation API
  // For now, we'll simulate the process
  
  // Simulate video processing time based on duration and number of articles
  const processingTime = config.duration * 50 + (config.newsArticles.length * 200);
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  // Extract hashtags from news content
  const hashtags = ['crypto', 'cryptocurrency', 'blockchain', 'news'];
  config.newsArticles.forEach(article => {
    const title = article.title.toLowerCase();
    if (title.includes('bitcoin')) hashtags.push('bitcoin');
    if (title.includes('ethereum')) hashtags.push('ethereum');
    if (title.includes('defi')) hashtags.push('defi');
    if (title.includes('nft')) hashtags.push('nft');
  });
  
  // Remove duplicate hashtags
  const uniqueHashtags = [...new Set(hashtags)];
  
  // Extract key content points for the video
  const keyPoints = extractKeyPoints(config.newsArticles);
  
  // Generate video segments
  const videoSegments = generateVideoSegments(config.newsArticles, config.duration);
  
  // Generate a video object
  const video: GeneratedVideo = {
    id: `video-${Date.now()}`,
    title: config.title,
    description: config.description,
    thumbnailUrl: config.newsArticles[0]?.imageUrl || 'https://via.placeholder.com/640x360?text=Crypto+News',
    videoUrl: '#', // In a real app, this would be a URL to the generated video
    createdAt: new Date().toISOString(),
    duration: config.duration,
    hashtags: uniqueHashtags,
    status: 'completed',
    socialPlatforms: {
      twitter: true,
      youtube: false,
      tiktok: false,
      instagram: false
    }
  };
  
  // In a real implementation, the video would be generated here using the config and news articles
  console.log('Generating video based on:', {
    articleCount: config.newsArticles.length,
    keyPoints,
    videoSegments,
    style: config.style,
    voiceover: config.includeVoiceover,
    backgroundMusic: config.includeBackground
  });
  
  return video;
};

// Function to generate a video thumbnail
export const generateThumbnail = async (videoId: string, imageUrl: string): Promise<string> => {
  // In a real application, this would generate a thumbnail
  // For now, we'll just return the image URL
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return imageUrl;
};

// Function to download the generated video
export const downloadVideo = async (video: GeneratedVideo): Promise<boolean> => {
  try {
    console.log('Starting download for video:', video.title);
    
    // In a real application, this would download the actual video file
    // For this demo, we'll create a mock MP4 file
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a simpler approach for generating a dummy video file
    const videoData = new Uint8Array([0, 0, 0, 32, 102, 116, 121, 112, 109, 112, 52, 50]);
    const blob = new Blob([videoData], { type: 'video/mp4' });
    console.log('Created video blob with size:', blob.size);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${video.id}.mp4`;

    // This is crucial - append to document, trigger click, and remove
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Download link cleaned up');
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error downloading video:', error);
    return false;
  }
};

