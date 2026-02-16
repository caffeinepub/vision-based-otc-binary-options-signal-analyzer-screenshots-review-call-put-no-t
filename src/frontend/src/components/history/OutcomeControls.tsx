import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MinusCircle, HelpCircle } from 'lucide-react';
import { Outcome } from '../../backend';

interface OutcomeControlsProps {
  outcome?: Outcome;
  taken: boolean;
  onOutcomeChange: (outcome: Outcome) => void;
  onTakenChange: (taken: boolean) => void;
  disabled?: boolean;
}

export default function OutcomeControls({ 
  outcome, 
  taken, 
  onOutcomeChange, 
  onTakenChange,
  disabled 
}: OutcomeControlsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Trade Status:</span>
        <Button
          size="sm"
          variant={taken ? 'default' : 'outline'}
          onClick={() => onTakenChange(!taken)}
          disabled={disabled}
        >
          {taken ? 'Taken' : 'Not Taken'}
        </Button>
      </div>

      {taken && (
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={outcome === Outcome.win ? 'default' : 'outline'}
            onClick={() => onOutcomeChange(Outcome.win)}
            className={outcome === Outcome.win ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Win
          </Button>
          <Button
            size="sm"
            variant={outcome === Outcome.loss ? 'default' : 'outline'}
            onClick={() => onOutcomeChange(Outcome.loss)}
            className={outcome === Outcome.loss ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Loss
          </Button>
          <Button
            size="sm"
            variant={outcome === Outcome.unknown_ ? 'default' : 'outline'}
            onClick={() => onOutcomeChange(Outcome.unknown_)}
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            Unknown
          </Button>
        </div>
      )}

      {outcome && (
        <Badge variant={
          outcome === Outcome.win ? 'default' : 
          outcome === Outcome.loss ? 'destructive' : 
          'secondary'
        }>
          {outcome === Outcome.win ? 'Win' : 
           outcome === Outcome.loss ? 'Loss' : 
           outcome === Outcome.notTaken ? 'Not Taken' : 'Unknown'}
        </Badge>
      )}
    </div>
  );
}
