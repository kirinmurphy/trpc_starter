export function FormErrorMessage ({ msg } : { msg: string }) {
  return (
    <div className="pt-2 text-red-400">{msg}</div>
  );
}
