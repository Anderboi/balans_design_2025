
const DataLabelValue = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <p className="grid grid-cols-4">
      <span className="text-muted-foreground col-span-1">{label}:</span>
      <span className=" font-semibold col-span-3 line-clamp-1">{children}</span>
    </p>
  );
}

export default DataLabelValue