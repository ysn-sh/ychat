// components/auth/UsernameInput.tsx
import { Input } from "../common/Input";

interface UsernameInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function UsernameInput({ value, onChange, error }: UsernameInputProps) {
  return (
    <Input
      label="Username"
      value={value}
      onChange={onChange}
      error={error}
      autoComplete="off"
    />
  );
}