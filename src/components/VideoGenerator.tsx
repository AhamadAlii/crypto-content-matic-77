import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Video, 
  Sparkles, 
  Play, 
  Clock, 
  Film, 
  Mic, 
  Image as ImageIcon,
  RefreshCw,
  CheckCheck 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VideoConfig, NewsArticle, GeneratedVideo } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { generateVideo } from '@/utils/videoService';

interface VideoGeneratorProps {
  selectedArticles: NewsArticle[];
  onVideoGenerated: (video: GeneratedVideo) => void;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ selectedArticles, onVideoGenerated }) => {
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({
    title: selectedArticles.length > 0 ? `Crypto News: ${selectedArticles[0].title}` : 'Today\'s Crypto News Roundup',
    description: `Latest cryptocurrency news and analysis`,
    newsArticles: selectedArticles,
    style: 'professional',
    duration: 60,
    includeVoiceover: true,
    includeBackground: true,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVideoConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setVideoConfig(prev => ({ ...prev, [name]: checked }));
  };

  const handleDurationChange = (value: number[]) => {
    setVideoConfig(prev => ({ ...prev, duration: value[0] }));
  };

  const handleStyleChange = (value: string) => {
    setVideoConfig(prev => ({ ...prev, style: value as 'professional' | 'casual' | 'dramatic' }));
  };

  const handleVideoGeneration = async () => {
    if (selectedArticles.length === 0) {
      toast({
        title: "No articles selected",
        description: "Please select at least one news article to generate a video.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate progress while the real generation happens
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 90) {
          clearInterval(interval);
          return 90;
        }
        return newProgress;
      });
    }, 500);

    try {
      // Use the real video generation service
      const generatedVideo = await generateVideo(videoConfig);
      
      // Set progress to 100% when complete
      setGenerationProgress(100);
      clearInterval(interval);
      
      onVideoGenerated(generatedVideo);
      
      toast({
        title: "Video generated successfully",
        description: "Your video is now ready to be shared.",
      });
    } catch (error) {
      console.error("Error generating video:", error);
      toast({
        title: "Error generating video",
        description: "An error occurred while generating the video. Please try again.",
        variant: "destructive",
      });
      
      clearInterval(interval);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="glass-card animate-scale-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-primary" />
          <CardTitle>Video Generator</CardTitle>
        </div>
        <CardDescription>Create engaging videos from selected news articles</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="title">Video Title</Label>
          <Input 
            id="title" 
            name="title" 
            className="glass-input"
            value={videoConfig.title} 
            onChange={handleChange} 
            disabled={isGenerating}
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="description">Video Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            className="glass-input min-h-[80px]"
            value={videoConfig.description} 
            onChange={handleChange} 
            disabled={isGenerating}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="style">Video Style</Label>
            <Select 
              value={videoConfig.style} 
              onValueChange={handleStyleChange}
              disabled={isGenerating}
            >
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="dramatic">Dramatic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <span className="text-sm text-muted-foreground">{videoConfig.duration}s</span>
            </div>
            <Slider 
              id="duration"
              min={30}
              max={180}
              step={15}
              value={[videoConfig.duration]}
              onValueChange={handleDurationChange}
              disabled={isGenerating}
              className="py-2"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="includeVoiceover" className="text-base">Voiceover</Label>
              <p className="text-sm text-muted-foreground">Include AI-generated voice narration</p>
            </div>
            <Switch 
              id="includeVoiceover"
              checked={videoConfig.includeVoiceover}
              onCheckedChange={(checked) => handleSwitchChange('includeVoiceover', checked)}
              disabled={isGenerating}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="includeBackground" className="text-base">Background Music</Label>
              <p className="text-sm text-muted-foreground">Add mood-appropriate background music</p>
            </div>
            <Switch 
              id="includeBackground"
              checked={videoConfig.includeBackground}
              onCheckedChange={(checked) => handleSwitchChange('includeBackground', checked)}
              disabled={isGenerating}
            />
          </div>
        </div>
        
        {isGenerating && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <Label>Generation Progress</Label>
              <span className="text-sm font-medium">{Math.round(generationProgress)}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <div className="flex justify-center pt-2">
              {generationProgress < 100 ? (
                <RefreshCw className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <CheckCheck className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full"
          disabled={isGenerating || selectedArticles.length === 0}
          onClick={handleVideoGeneration}
        >
          {isGenerating ? 'Generating...' : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Video
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoGenerator;
