import { useRef } from "react";
import "./FileUpload.css";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

export function FileUpload({ onFileSelect, accept = "image/*,application/pdf" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="file-upload">
      <button className="file-upload-trigger" onClick={handleClick}>
        📎
      </button>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
        style={{ display: "none" }}
      />
    </div>
  );
}