
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Share, CalendarIcon, Plus, Twitter, Youtube, Instagram, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { GeneratedVideo, SocialPostConfig, SocialPostResult } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { postToTwitter, postToYouTube, postToInstagram, schedulePost } from '@/utils/socialService';

interface SocialPosterProps {
  video: GeneratedVideo;
}

const SocialPoster: React.FC<SocialPosterProps> = ({ video }) => {
  const [caption, setCaption] = useState<string>(`Check out my latest crypto news update: ${video.title} #crypto #news`);
  const [hashtags, setHashtags] = useState<string[]>(video.hashtags || ['crypto', 'news', 'bitcoin']);
  const [newHashtag, setNewHashtag] = useState<string>('');
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("12:00");
  const [isPosting, setIsPosting] = useState(false);
  const [postResults, setPostResults] = useState<Record<string, SocialPostResult>>({});
  const [platforms, setPlatforms] = useState({
    twitter: true,
    youtube: false,
    instagram: false,
  });

  const handlePlatformChange = (platform: keyof typeof platforms) => {
    setPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const addHashtag = () => {
    if (newHashtag && !hashtags.includes(newHashtag)) {
      setHashtags([...hashtags, newHashtag]);
      setNewHashtag('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handlePostNow = async () => {
    if (!Object.values(platforms).some(value => value)) {
      toast({
        title: "No platform selected",
        description: "Please select at least one social media platform.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPosting(true);
    const results: Record<string, SocialPostResult> = {};
    
    try {
      // Post to selected platforms
      if (platforms.twitter) {
        const success = await postToTwitter(video, caption, hashtags);
        results.twitter = { 
          success, 
          message: success ? "Posted successfully to Twitter" : "Failed to post to Twitter" 
        };
      }
      
      if (platforms.youtube) {
        const success = await postToYouTube(video, video.title, caption, hashtags);
        results.youtube = { 
          success, 
          message: success ? "Posted successfully to YouTube" : "Failed to post to YouTube" 
        };
      }
      
      if (platforms.instagram) {
        const success = await postToInstagram(video, caption, hashtags);
        results.instagram = { 
          success, 
          message: success ? "Posted successfully to Instagram" : "Failed to post to Instagram" 
        };
      }
      
      setPostResults(results);
      
      // Show toast with results
      const successCount = Object.values(results).filter(r => r.success).length;
      const totalCount = Object.values(results).length;
      
      if (successCount === totalCount) {
        toast({
          title: "Posted successfully",
          description: `Your video has been posted to ${successCount} platform${successCount !== 1 ? 's' : ''}.`,
        });
      } else if (successCount > 0) {
        toast({
          title: "Partially successful",
          description: `Posted to ${successCount}/${totalCount} platforms. Check results for details.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Posting failed",
          description: "Failed to post to any platform. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error posting content:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while posting.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!Object.values(platforms).some(value => value)) {
      toast({
        title: "No platform selected",
        description: "Please select at least one social media platform.",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "No date selected",
        description: "Please select a date for scheduling.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPosting(true);
    
    try {
      // Create a Date object for the scheduled time
      const scheduledDate = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      scheduledDate.setHours(hours, minutes, 0, 0);
      
      // Ensure the scheduled time is in the future
      if (scheduledDate <= new Date()) {
        toast({
          title: "Invalid scheduling time",
          description: "The scheduled time must be in the future.",
          variant: "destructive",
        });
        setIsPosting(false);
        return;
      }
      
      const platforms = [];
      if (platforms.twitter) platforms.push('twitter');
      if (platforms.youtube) platforms.push('youtube');
      if (platforms.instagram) platforms.push('instagram');
      
      // Schedule posts for each platform
      const schedulingPromises = Object.entries(platforms)
        .filter(([_, enabled]) => enabled)
        .map(([platform]) => {
          const config: SocialPostConfig = {
            platformId: platform as any,
            scheduledTime: scheduledDate.toISOString(),
            caption,
            hashtags,
            videoId: video.id,
          };
          
          return schedulePost(config);
        });
      
      const results = await Promise.all(schedulingPromises);
      
      if (results.every(Boolean)) {
        toast({
          title: "Scheduled successfully",
          description: `Your video will be posted at ${format(scheduledDate, 'PPP')} at ${time}.`,
        });
      } else {
        toast({
          title: "Scheduling partially failed",
          description: "Some platforms could not be scheduled. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error scheduling posts:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while scheduling.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="glass-card animate-scale-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Share className="w-5 h-5 text-primary" />
          <CardTitle>Social Media Publisher</CardTitle>
        </div>
        <CardDescription>Schedule and publish your video to social platforms</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Video preview section */}
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
        
        {/* Caption section */}
        <div className="space-y-3">
          <Label htmlFor="caption">Caption</Label>
          <Textarea 
            id="caption" 
            className="glass-input min-h-[80px]"
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            placeholder="Write a caption for your social media post..."
            disabled={isPosting}
          />
        </div>
        
        {/* Hashtags section */}
        <div className="space-y-3">
          <Label>Hashtags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                #{tag}
                <button 
                  type="button"
                  onClick={() => removeHashtag(tag)}
                  className="ml-1 hover:text-destructive"
                  disabled={isPosting}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              className="glass-input flex-1"
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a hashtag"
              disabled={isPosting}
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={addHashtag}
              disabled={!newHashtag || isPosting}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Schedule section */}
        <div className="space-y-4">
          <Label>Schedule Post</Label>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "glass-input justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  disabled={isPosting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            
            <Input
              type="time"
              className="glass-input w-32"
              value={time}
              onChange={handleTimeChange}
              disabled={isPosting}
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Platforms section */}
        <div className="space-y-3">
          <Label>Platforms</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                <span>Twitter</span>
              </div>
              <Switch 
                checked={platforms.twitter} 
                onCheckedChange={() => handlePlatformChange('twitter')}
                disabled={isPosting}
              />
              {postResults.twitter && (
                <Badge variant={postResults.twitter.success ? "outline" : "destructive"} className="ml-2 text-xs">
                  {postResults.twitter.success ? "Posted" : "Failed"}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-[#FF0000]" />
                <span>YouTube</span>
              </div>
              <Switch 
                checked={platforms.youtube} 
                onCheckedChange={() => handlePlatformChange('youtube')}
                disabled={isPosting}
              />
              {postResults.youtube && (
                <Badge variant={postResults.youtube.success ? "outline" : "destructive"} className="ml-2 text-xs">
                  {postResults.youtube.success ? "Posted" : "Failed"}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-[#E1306C]" />
                <span>Instagram</span>
              </div>
              <Switch 
                checked={platforms.instagram} 
                onCheckedChange={() => handlePlatformChange('instagram')}
                disabled={isPosting}
              />
              {postResults.instagram && (
                <Badge variant={postResults.instagram.success ? "outline" : "destructive"} className="ml-2 text-xs">
                  {postResults.instagram.success ? "Posted" : "Failed"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          className="w-full"
          disabled={isPosting || !Object.values(platforms).some(value => value)}
          onClick={handlePostNow}
          variant="default"
        >
          {isPosting ? 'Posting...' : 'Post Now'}
        </Button>
        
        <Button 
          className="w-full"
          disabled={isPosting || !Object.values(platforms).some(value => value)}
          onClick={handleSchedulePost}
          variant="outline"
        >
          {isPosting ? 'Scheduling...' : (
            <>
              <Clock className="mr-2 h-4 w-4" />
              Schedule Post
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SocialPoster;
