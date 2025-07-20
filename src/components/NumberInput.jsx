import { useState, useRef, useEffect } from "react";

// React component that either displays an numeric input field when in editing
// mode or displays the current value as text when in non-editing mode.
export default function NumberInput({
  // The initial value
  initValue,
  // Minimum allowed value
  min = -Infinity,
  // Maximum allowed value
  max = Infinity,
  // Function to be called when exiting editing mode, recieves the new value
  // as its only argument
  onSave,
  // Whether or not to disable interactivity
  disabled,
}) {
  // Whether or not the component is in editing mode
  const [editing, setEditing] = useState(false);
  // Points to the input component
  const inputRef = useRef(null);

  // Focus the input component when entering edit mode
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  function verifyValue(number) {
    return min <= number && number <= max;
  }

  // Verify the current value and either enter or exit editing mode
  function handleButtonClick() {
    if (editing) {
      if (verifyValue(inputRef.current.value)) {
        setEditing(false);
        onSave(inputRef.current.value);
      } else {
        if (min !== -Infinity && max !== Infinity) {
          alert(`Must enter a nunmber between ${min} and ${max}`);
        } else if (min === -Infinity) {
          alert(`Must enter a number lower than ${max}`);
        } else {
          alert(`Must enter a number greater than ${min}`);
        }
      }
    } else {
      setEditing(true);
    }
  }

  return (
    <>
      {editing && (
        <input
          ref={inputRef}
          disabled={disabled}
          type="number"
          defaultValue={initValue}
        />
      )}
      {!editing &&
        (inputRef.current === null ? initValue : inputRef.current.value)}{" "}
      <button disabled={disabled} onClick={handleButtonClick}>
        {editing ? "Save" : "Edit"}
      </button>
    </>
  );
}
