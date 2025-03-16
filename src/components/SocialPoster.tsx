
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { GeneratedVideo } from '@/types';
import VideoPreview from './social/VideoPreview';

interface SocialPosterProps {
  video: GeneratedVideo;
}

const SocialPoster: React.FC<SocialPosterProps> = ({ video }) => {
  return (
    <Card className="glass-card animate-scale-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          <CardTitle>Download Your Video</CardTitle>
        </div>
        <CardDescription>Your video is ready to be downloaded</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Video preview section with download button */}
        <VideoPreview video={video} />
      </CardContent>
    </Card>
  );
};

export default SocialPoster;
