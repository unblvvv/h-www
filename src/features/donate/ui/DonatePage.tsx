import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

export default function DonatePage() {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const presetAmounts = [5, 10, 20, 50];

  const handleDonate = () => {
    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount <= 0) {
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-6 border-2 border-[#E5E7EB]">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-[#10B981]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-[#111827]">Thank You!</h2>
            <p className="text-[#6B7280]">
              Your donation helps us continue caring for animals in need. Every
              contribution makes a difference.
            </p>
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full border-2 border-[#E5E7EB]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-[#22C55E]" />
          </div>
          <h1 className="text-[#111827] mb-2">Support Our Shelter</h1>
          <p className="text-[#6B7280]">
            Your donation helps us feed, care for, and find homes for animals in
            need.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[#111827] mb-3">Select an amount</label>
            <div className="grid grid-cols-4 gap-3">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedAmount === amount
                      ? 'border-[#22C55E] bg-[#22C55E] text-white'
                      : 'border-[#E5E7EB] hover:border-[#22C55E] text-[#111827]'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#111827] mb-2">Custom amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                $
              </span>
              <Input
                type="number"
                placeholder="0"
                min="1"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="pl-8"
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleDonate}
            disabled={
              processing || (!selectedAmount && !parseFloat(customAmount))
            }
          >
            {processing ? 'Processing...' : 'Donate'}
          </Button>
        </div>
      </div>
    </div>
  );
}
