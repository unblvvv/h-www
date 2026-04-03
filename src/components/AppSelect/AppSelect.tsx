import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import './AppSelect.scss';

export interface AppSelectOption {
  value: string;
  label: string;
}

interface AppSelectProps {
  value: string;
  options: AppSelectOption[];
  ariaLabel: string;
  onValueChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function AppSelect({ value, options, ariaLabel, onValueChange, className = '', disabled }: AppSelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectPrimitive.Trigger className={`app-select ${className}`.trim()} aria-label={ariaLabel}>
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon className="app-select__icon">
          <ChevronDown size={16} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="app-select__content" position="popper" sideOffset={8}>
          <SelectPrimitive.Viewport className="app-select__viewport">
            {options.map((option) => (
              <SelectPrimitive.Item key={option.value} value={option.value} className="app-select__item">
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="app-select__item-indicator">
                  <Check size={14} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
