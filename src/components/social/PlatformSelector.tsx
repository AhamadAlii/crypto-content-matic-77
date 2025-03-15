
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Twitter, Youtube, Instagram } from 'lucide-react';
import { SocialPostResult } from '@/types';

interface PlatformSelectorProps {
  platforms: {
    twitter: boolean;
    youtube: boolean;
    instagram: boolean;
  };
  handlePlatformChange: (platform: 'twitter' | 'youtube' | 'instagram') => void;
  isDisabled: boolean;
  postResults: Record<string, SocialPostResult>;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ platforms, handlePlatformChange, isDisabled, postResults }) => {
  return (
    <div className="space-y-3">
      <Label>Platforms</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
            <span>Twitter</span>
            <Badge variant="outline" className="text-xs">Mock</Badge>
          </div>
          <div className="flex items-center">
            {postResults.twitter && (
              <Badge variant={postResults.twitter.success ? "outline" : "destructive"} className="mr-2 text-xs">
                {postResults.twitter.success ? "Posted" : "Failed"}
              </Badge>
            )}
            <Switch 
              checked={platforms.twitter} 
              onCheckedChange={() => handlePlatformChange('twitter')}
              disabled={isDisabled}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-[#FF0000]" />
            <span>YouTube</span>
            <Badge variant="outline" className="text-xs">Mock</Badge>
          </div>
          <div className="flex items-center">
            {postResults.youtube && (
              <Badge variant={postResults.youtube.success ? "outline" : "destructive"} className="mr-2 text-xs">
                {postResults.youtube.success ? "Posted" : "Failed"}
              </Badge>
            )}
            <Switch 
              checked={platforms.youtube} 
              onCheckedChange={() => handlePlatformChange('youtube')}
              disabled={isDisabled}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-[#E1306C]" />
            <span>Instagram</span>
            <Badge variant="outline" className="text-xs">Mock</Badge>
          </div>
          <div className="flex items-center">
            {postResults.instagram && (
              <Badge variant={postResults.instagram.success ? "outline" : "destructive"} className="mr-2 text-xs">
                {postResults.instagram.success ? "Posted" : "Failed"}
              </Badge>
            )}
            <Switch 
              checked={platforms.instagram} 
              onCheckedChange={() => handlePlatformChange('instagram')}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelector;
