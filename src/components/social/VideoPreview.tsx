
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, Play, Pause } from 'lucide-react';
import { GeneratedVideo } from '@/types';
import { downloadVideo } from '@/utils/videoService';
import { toast } from '@/components/ui/use-toast';

interface VideoPreviewProps {
  video: GeneratedVideo;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ video }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const togglePlayPause = () => {
    const videoElement = document.getElementById('crypto-video') as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play().catch(error => {
          console.error('Error playing video:', error);
          toast({
            title: "Playback error",
            description: "Could not play the video. Please try again.",
            variant: "destructive",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-shimmer"></div>
      
      <div className="flex flex-col gap-4">
        {/* Video player */}
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          {video.videoUrl && video.videoUrl !== '#' ? (
            <>
              <video 
                id="crypto-video"
                className="w-full h-full object-contain"
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                controls={false}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error('Video error:', e);
                  toast({
                    title: "Video error",
                    description: "There was an error loading the video.",
                    variant: "destructive",
                  });
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  onClick={togglePlayPause} 
                  size="icon" 
                  className="w-12 h-12 rounded-full bg-primary/80 hover:bg-primary transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/80">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
        
        {/* Video info */}
        <div className="flex md:items-center gap-4 md:flex-row flex-col">
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
    </div>
  );
};

export default VideoPreview;
