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

// Creates a simple video for preview purposes
const createPreviewVideo = async (article: NewsArticle): Promise<string> => {
  return new Promise((resolve) => {
    // Create a canvas to draw on
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Could not get canvas context');
      // Return a placeholder video URL if canvas context is not available
      resolve('/placeholder.svg');
      return;
    }
    
    // Draw background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw article image if available
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Draw the image centered in the canvas
      const aspectRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.width / aspectRatio;
      
      if (drawHeight > canvas.height) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * aspectRatio;
      }
      
      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;
      
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      
      // Add title text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
      
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      
      // Wrap text to fit width
      const words = article.title.split(' ');
      let line = '';
      let y = canvas.height - 50;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > canvas.width - 40 && i > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[i] + ' ';
          y += 30;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);
      
      // Convert canvas to video-compatible format
      canvas.toBlob((blob) => {
        if (blob) {
          const videoUrl = URL.createObjectURL(blob);
          resolve(videoUrl);
        } else {
          console.error('Failed to create blob from canvas');
          resolve('/placeholder.svg');
        }
      }, 'image/jpeg');
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', article.imageUrl);
      
      // Draw placeholder content
      ctx.fillStyle = '#333333';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add title
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('Crypto News', canvas.width / 2, canvas.height / 2 - 50);
      ctx.fillText(article.title, canvas.width / 2, canvas.height / 2);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const videoUrl = URL.createObjectURL(blob);
          resolve(videoUrl);
        } else {
          resolve('/placeholder.svg');
        }
      }, 'image/jpeg');
    };
    
    // Set the source of the image
    img.src = article.imageUrl;
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
  
  // Create a preview video URL
  let videoUrl = '#';
  if (config.newsArticles.length > 0) {
    try {
      videoUrl = await createPreviewVideo(config.newsArticles[0]);
    } catch (error) {
      console.error('Error creating preview video:', error);
    }
  }
  
  // Generate a video object
  const video: GeneratedVideo = {
    id: `video-${Date.now()}`,
    title: config.title,
    description: config.description,
    thumbnailUrl: config.newsArticles[0]?.imageUrl || 'https://via.placeholder.com/640x360?text=Crypto+News',
    videoUrl: videoUrl,
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
