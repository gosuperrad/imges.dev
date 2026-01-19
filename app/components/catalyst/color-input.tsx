import { Button } from './button';
import { Input } from './input';
import { Field, Label } from './fieldset';
import { SparklesIcon } from '@heroicons/react/16/solid';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onRandomize?: () => void;
  placeholder?: string;
  className?: string;
}

/**
 * Reusable color input component with color picker, text input, and optional randomize button
 */
export function ColorInput({
  label,
  value,
  onChange,
  onRandomize,
  placeholder = 'cccccc',
  className = '',
}: ColorInputProps) {
  return (
    <Field className={className}>
      <Label>{label}</Label>
      <div className="flex items-center gap-2 mt-2">
        <div className="relative shrink-0">
          <input
            type="color"
            value={`#${value || placeholder}`}
            onChange={(e) => onChange(e.target.value.slice(1))}
            className="w-[42px] h-[42px] rounded-lg cursor-pointer border-2 border-zinc-700 bg-zinc-900"
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
            }}
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.replace('#', ''))}
          className="flex-1 font-mono text-sm uppercase"
          placeholder={placeholder}
        />
        {onRandomize && (
          <Button color="indigo" onClick={onRandomize}>
            <SparklesIcon />
          </Button>
        )}
      </div>
    </Field>
  );
}
