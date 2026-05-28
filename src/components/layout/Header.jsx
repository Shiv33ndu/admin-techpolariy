export default function Header({ title }) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold">
        {title}
      </h2>
    </div>
  );
}