// components/auth/register/EmailInput.tsx
import { Input } from "../../common/Input";

interface EmailInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function EmailInput({ value, onChange, error }: EmailInputProps) {
  return (
    <Input
      type="email"
      label="Email"
      value={value}
      onChange={onChange}
      error={error}
      autoComplete="off"
    />
  );
}