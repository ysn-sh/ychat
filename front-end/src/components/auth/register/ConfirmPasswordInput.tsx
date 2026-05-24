import { Input } from "../../common/Input";

interface ConfirmPasswordInputProps {
  password: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function ConfirmPasswordInput({
  value,
  onChange,
  error,
}: ConfirmPasswordInputProps) {
  return (
    <Input
      type="password"
      label="Confirm Password"
      value={value}
      onChange={onChange}
      error={error}
      autoComplete="new-password"
    />
  );
}