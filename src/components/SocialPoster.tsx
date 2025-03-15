
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Share, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { GeneratedVideo, SocialPostConfig, SocialPostResult } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { postToTwitter, postToYouTube, postToInstagram, schedulePost } from '@/utils/socialService';

// Import the new components
import VideoPreview from './social/VideoPreview';
import CaptionEditor from './social/CaptionEditor';
import HashtagManager from './social/HashtagManager';
import DateTimePicker from './social/DateTimePicker';
import PlatformSelector from './social/PlatformSelector';

interface SocialPosterProps {
  video: GeneratedVideo;
}

const SocialPoster: React.FC<SocialPosterProps> = ({ video }) => {
  const [caption, setCaption] = useState<string>(`Check out my latest crypto news update: ${video.title} #crypto #news`);
  const [hashtags, setHashtags] = useState<string[]>(video.hashtags || ['crypto', 'news', 'bitcoin']);
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
      
      // Schedule posts for each platform
      const selectedPlatforms = Object.entries(platforms)
        .filter(([_, enabled]) => enabled)
        .map(([platform]) => platform);
      
      const schedulingPromises = selectedPlatforms.map(platform => {
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
        <VideoPreview video={video} />
        
        {/* Caption section */}
        <CaptionEditor 
          caption={caption} 
          setCaption={setCaption} 
          isDisabled={isPosting} 
        />
        
        {/* Hashtags section */}
        <HashtagManager 
          hashtags={hashtags} 
          setHashtags={setHashtags} 
          isDisabled={isPosting} 
        />
        
        <Separator />
        
        {/* Schedule section */}
        <DateTimePicker 
          date={date} 
          setDate={setDate} 
          time={time} 
          setTime={setTime} 
          isDisabled={isPosting} 
        />
        
        <Separator />
        
        {/* Platforms section */}
        <PlatformSelector 
          platforms={platforms} 
          handlePlatformChange={handlePlatformChange} 
          isDisabled={isPosting} 
          postResults={postResults} 
        />
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
