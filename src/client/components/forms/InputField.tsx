
interface Props {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function InputField ({ name, label, value, onChange }: Props) {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 font-medium">{label}</label>
      <input
        className="w-full px-3 py-2 border rounded-md"
        id={name}
        type={name}
        value={value}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
