
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { GeneratedVideo } from '@/types';

interface VideoPreviewProps {
  video: GeneratedVideo;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ video }) => {
  return (
    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-shimmer"></div>
      <div className="flex md:items-center gap-4 md:flex-row flex-col">
        <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
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
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs px-2 py-0 border-green-500/30 text-green-600 dark:text-green-400">
              Ready
            </Badge>
            <span className="text-xs text-muted-foreground">
              Created {format(new Date(video.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
