import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BulkPack {
  size: number;
  price: number;
  label: string;
}

interface BulkPackPricingProps {
  value: BulkPack[];
  onChange: (packs: BulkPack[]) => void;
}

const defaultPacks: BulkPack[] = [
  { size: 6, price: 0, label: 'Pack of 6' },
  { size: 12, price: 0, label: 'Pack of 12' },
  { size: 24, price: 0, label: 'Pack of 24' },
];

const BulkPackPricing = ({ value, onChange }: BulkPackPricingProps) => {
  const packs = value.length > 0 ? value : defaultPacks;

  const handlePriceChange = (size: number, price: number) => {
    const updatedPacks = packs.map((pack) =>
      pack.size === size ? { ...pack, price } : pack
    );
    onChange(updatedPacks);
  };

  return (
    <div className="space-y-3">
      <Label>Bulk Pack Pricing</Label>
      <div className="grid grid-cols-3 gap-4">
        {packs.map((pack) => (
          <div key={pack.size} className="space-y-1">
            <Label className="text-xs text-muted-foreground">{pack.label}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                type="number"
                className="pl-7"
                placeholder="0"
                value={pack.price || ''}
                onChange={(e) => handlePriceChange(pack.size, Number(e.target.value))}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Set prices for each bulk pack size. Leave at 0 to use base price calculation.
      </p>
    </div>
  );
};

export default BulkPackPricing;
