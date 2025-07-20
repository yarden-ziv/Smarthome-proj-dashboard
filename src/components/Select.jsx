// A React-compatible select input
export default function Select({
  // The label for the select input
  label,
  // The currently selected value
  value,
  // The different possible options. Should be an array of { label: "...",
  // value: "..."} objects.
  options,
  // Function to be called when the selected value changes. Recieves the new
  // value as its only argument.
  onChange,
  // Whether or not to disable the component
  disabled,
}) {
  return (
    <label>
      {label}
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
