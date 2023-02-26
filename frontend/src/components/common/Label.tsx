interface PropsTypes {
  label?: string;
  isRequierd?: boolean;
  isError?: boolean;
  id?: string;
}

const Label = ({ label, isRequierd, isError, id }: PropsTypes) => {
  const labelWrapperClassName = isError ? "label-wrapper error" : "label-wrapper";

  return (
    <label className={labelWrapperClassName} htmlFor={id}>
      {label}
      {isRequierd && "*"}
    </label>
  );
};

export default Label;
