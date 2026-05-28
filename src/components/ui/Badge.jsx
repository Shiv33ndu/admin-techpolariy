export default function Badge({ text }) {
  return (
    <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
      {text}
    </span>
  );
}