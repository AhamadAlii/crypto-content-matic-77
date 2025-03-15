
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface HashtagManagerProps {
  hashtags: string[];
  setHashtags: (hashtags: string[]) => void;
  isDisabled: boolean;
}

const HashtagManager: React.FC<HashtagManagerProps> = ({ hashtags, setHashtags, isDisabled }) => {
  const [newHashtag, setNewHashtag] = useState<string>('');

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

  return (
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
              disabled={isDisabled}
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
          disabled={isDisabled}
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={addHashtag}
          disabled={!newHashtag || isDisabled}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HashtagManager;
