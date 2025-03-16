
import React, { useState, useRef, useEffect } from 'react';
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
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Reset video state when video URL changes
    setIsPlaying(false);
    setIsVideoLoaded(false);
  }, [video.videoUrl]);

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
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // Check if video can be played
      if (video.videoUrl && video.videoUrl !== '#') {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Error playing video:', error);
          toast({
            title: "Playback error",
            description: "Could not play the video. Using fallback display.",
            variant: "destructive",
          });
          setIsPlaying(false);
        });
      } else {
        toast({
          title: "Playback unavailable",
          description: "This video cannot be played in the preview.",
        });
      }
    }
  };

  // Determine if we should show the video element or fallback to image
  const shouldShowVideo = video.videoUrl && video.videoUrl !== '#';

  return (
    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-shimmer"></div>
      
      <div className="flex flex-col gap-4">
        {/* Video player */}
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          {shouldShowVideo ? (
            <>
              <video 
                ref={videoRef}
                id="crypto-video"
                className="w-full h-full object-contain"
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                preload="metadata"
                playsInline
                muted
                onCanPlay={() => setIsVideoLoaded(true)}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error('Video error:', e);
                  setIsVideoLoaded(false);
                }}
              />
              {!isVideoLoaded && (
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-contain z-10"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center z-20">
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
