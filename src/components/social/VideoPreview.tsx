
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { GeneratedVideo } from '@/types';
import { downloadVideo } from '@/utils/videoService';
import { toast } from '@/components/ui/use-toast';

interface VideoPreviewProps {
  video: GeneratedVideo;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ video }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    console.log('Starting download process for video:', video.title);
    
    try {
      const success = await downloadVideo(video);
      
      if (success) {
        console.log('Download completed successfully');
        toast({
          title: "Video downloaded",
          description: `${video.title} has been downloaded successfully.`,
        });
      } else {
        console.log('Download failed');
        toast({
          title: "Download failed",
          description: "There was an error downloading the video. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleDownload:', error);
      toast({
        title: "Download error",
        description: "An unexpected error occurred while downloading the video.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-shimmer"></div>
      <div className="flex md:items-center gap-4 md:flex-row flex-col">
        <div className="relative w-full md:w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium line-clamp-2 text-base">{video.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{video.description}</p>
          <div className="flex items-center flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs px-2 py-0 border-green-500/30 text-green-600 dark:text-green-400">
              Ready
            </Badge>
            <span className="text-xs text-muted-foreground">
              Created {format(new Date(video.createdAt), 'MMM d, yyyy')}
            </span>
            <Button 
              size="sm" 
              variant="default" 
              className="ml-auto mt-2 md:mt-0"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download Video'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
