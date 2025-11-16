const MaterialData = ({ label, value, children }: { label: string; value?: string | number, children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      {value &&<span className="text-sm text-ellipsis">{value}</span>}
      {children}
      <span className="text-muted-foreground/75 text-[10px] capitalize">
        {label.toUpperCase()}
      </span>
    </div>
  );
};

export default MaterialData;
