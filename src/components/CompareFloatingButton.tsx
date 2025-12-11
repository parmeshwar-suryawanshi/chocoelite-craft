import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitCompare } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';

const CompareFloatingButton = () => {
  const { compareItems, setIsCompareOpen } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <Button
      onClick={() => setIsCompareOpen(true)}
      className="fixed bottom-24 right-6 z-40 gradient-luxury text-white shadow-lg hover:opacity-90 h-14 px-6 rounded-full animate-fade-in"
    >
      <GitCompare className="h-5 w-5 mr-2" />
      Compare
      <Badge className="ml-2 bg-white text-luxury-brown h-6 w-6 p-0 flex items-center justify-center rounded-full">
        {compareItems.length}
      </Badge>
    </Button>
  );
};

export default CompareFloatingButton;
