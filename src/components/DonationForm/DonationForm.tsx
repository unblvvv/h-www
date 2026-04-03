import { useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import './DonationForm.scss';

interface DonationFormProps {
  onDonate: (amount: number) => void;
  disabled?: boolean;
}

const presetAmounts = [5, 10, 20, 50];

export function DonationForm({ onDonate, disabled }: DonationFormProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const amount = selectedAmount || Number(customAmount);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!amount || amount <= 0) {
      return;
    }

    onDonate(amount);
  };

  return (
    <form className="donation-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Select an amount</legend>
        <div className="donation-form__amounts">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              className={selectedAmount === preset ? 'is-active' : ''}
              onClick={() => {
                setSelectedAmount(preset);
                setCustomAmount('');
              }}
            >
              ${preset}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="donation-form__custom">
        <span>Custom amount</span>
        <Input
          type="number"
          min="1"
          value={customAmount}
          onChange={(event) => {
            setCustomAmount(event.target.value);
            setSelectedAmount(null);
          }}
          placeholder="Enter custom amount"
        />
      </label>

      <Button type="submit" size="lg" disabled={disabled || !amount || amount <= 0}>
        Donate now
      </Button>
    </form>
  );
}
