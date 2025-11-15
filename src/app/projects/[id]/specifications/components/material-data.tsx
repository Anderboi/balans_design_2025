const MaterialData = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col">
      <span className="text-base">{value}</span>
      <span className="text-muted-foreground/50 text-[10px] capitalize">
        {label.toUpperCase()}
      </span>
    </div>
  );
};

export default MaterialData;
