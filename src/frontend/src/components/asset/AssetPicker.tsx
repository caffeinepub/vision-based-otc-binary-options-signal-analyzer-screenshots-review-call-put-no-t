import { Asset } from '../../backend';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AssetPickerProps {
  value: Asset;
  onChange: (asset: Asset) => void;
}

export default function AssetPicker({ value, onChange }: AssetPickerProps) {
  return (
    <div className="space-y-3">
      <Label>Select OTC Asset</Label>
      <RadioGroup 
        value={value} 
        onValueChange={(v) => onChange(v as Asset)}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={Asset.eurUsdOtc} id="eur-usd" />
          <Label htmlFor="eur-usd" className="cursor-pointer">EUR/USD OTC</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={Asset.usdJpyOtc} id="usd-jpy" />
          <Label htmlFor="usd-jpy" className="cursor-pointer">USD/JPY OTC</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
