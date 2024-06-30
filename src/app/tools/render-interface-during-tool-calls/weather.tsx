export default function Weather({
  city,
  unit,
}: {
  city: string;
  unit: string;
}) {
  return (
    <div className="border border-border p-4">
      <div className="text-lg">{city}</div>
      <div>20 {unit}</div>
    </div>
  );
}
