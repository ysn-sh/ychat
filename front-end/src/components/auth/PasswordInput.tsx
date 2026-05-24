import { Input } from "../common/Input";

interface PasswordInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function PasswordInput({ value, onChange, error }: PasswordInputProps) {
  return (
    <Input
      type="password"
      label="Password"
      value={value}
      onChange={onChange}
      error={error}
      autoComplete="new-password"
    />
  );
}