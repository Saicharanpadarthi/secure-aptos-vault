
import React, { useState } from 'react';
import { useFiles } from '@/contexts/FileContext';
import FileCard from '@/components/FileCard';
import { useWallet } from '@/contexts/WalletContext';
import { TabsContent } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FileMetadata } from '@/types';

interface FileListProps {
  type: 'my-files' | 'shared-files';
  value: string;
}

const FileList: React.FC<FileListProps> = ({ type, value }) => {
  const { files } = useFiles();
  const { user } = useWallet();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFiles = files.filter(file => {
    // Filter by file ownership or shared status
    const isOwner = file.owner === user.address;
    const isShared = file.sharedWith.includes(user.address);
    const matchesType = type === 'my-files' ? isOwner : isShared;
    
    // Filter by search query
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  return (
    <TabsContent value={value} className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          className="pl-10 bg-secondary/50 border-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredFiles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {searchQuery ? 
              "No files matching your search" : 
              type === 'my-files' ? 
                "You haven't uploaded any files yet" : 
                "No files have been shared with you yet"
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map(file => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </TabsContent>
  );
};

export default FileList;
