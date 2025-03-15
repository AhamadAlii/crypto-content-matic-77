
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CaptionEditorProps {
  caption: string;
  setCaption: (caption: string) => void;
  isDisabled: boolean;
}

const CaptionEditor: React.FC<CaptionEditorProps> = ({ caption, setCaption, isDisabled }) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="caption">Caption</Label>
      <Textarea 
        id="caption" 
        className="glass-input min-h-[80px]"
        value={caption} 
        onChange={(e) => setCaption(e.target.value)} 
        placeholder="Write a caption for your social media post..."
        disabled={isDisabled}
      />
    </div>
  );
};

export default CaptionEditor;
