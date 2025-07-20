import TimeInput from "./TimeInput";
import NumberInput from "./NumberInput";
import Select from "./Select";
import {
  MIN_WATER_TEMP,
  MAX_WATER_TEMP,
  MIN_BRIGHTNESS,
  MAX_BRIGHTNESS,
  MIN_AC_TEMP,
  MAX_AC_TEMP,
} from "../constants";

export default function DeviceOptions({
  // e.g. water heater, light, etc.
  type,
  // Different device options, based on the type
  parameters,
  // Function to use when saving new device information.
  // Recieves the new information, as an object, as its only argument
  onSave,
  // Whether or not to disabled input fields
  disabled,
}) {
  switch (type) {
    case "water_heater":
      console.log(JSON.stringify(parameters));
      return (
        <ul>
          <li>Temperature: {parameters.temperature}</li>
          <li>
            Target temperature:{" "}
            <NumberInput
              initValue={parameters.target_temperature}
              min={MIN_WATER_TEMP}
              max={MAX_WATER_TEMP}
              onSave={(newTemperature) => {
                onSave({
                  target_temperature: newTemperature,
                });
              }}
              disabled={disabled}
            />
          </li>
          {parameters.is_heating && (
            <li>
              <span style={{ color: "#FF4500" }}>Heating</span>
            </li>
          )}
          {!parameters.is_heating && (
            <li>
              <span style={{ color: "#00BFFF" }}>Not heating</span>
            </li>
          )}
          <li>
            <label>
              Timer enabled:
              <input
                disabled={disabled}
                type="checkbox"
                checked={parameters.timer_enabled}
                onChange={() => {
                  onSave({
                    timer_enabled: !parameters.timer_enabled,
                  });
                }}
              />
            </label>
            {" Start time: "}
            <TimeInput
              initValue={parameters.scheduled_on}
              onSave={(newTime) => {
                onSave({
                  scheduled_on: newTime,
                });
              }}
              disabled={disabled}
            />
            {" Stop time: "}
            <TimeInput
              initValue={parameters.scheduled_off}
              onSave={(newTime) => {
                onSave({
                  scheduled_off: newTime,
                });
              }}
              disabled={disabled}
            />
          </li>
        </ul>
      );
    case "light":
      return (
        <ul>
          {parameters.is_dimmable && (
            <li>
              Brightness:{" "}
              <NumberInput
                initValue={parameters.brightness}
                min={MIN_BRIGHTNESS}
                max={MAX_BRIGHTNESS}
                onSave={(newBrightness) => {
                  onSave({
                    brightness: newBrightness,
                  });
                }}
                disabled={disabled}
              />
            </li>
          )}
          {parameters.dynamic_color && (
            <li>
              <label>
                Color:{" "}
                <input
                  disabled={disabled}
                  type="color"
                  defaultValue={parameters.color}
                  onBlur={(e) => {
                    // Only save the information when the user closes the
                    // color picker, otherwise there will be many unnecessary
                    // update requests sent to the server.
                    onSave({
                      color: e.target.value,
                    });
                  }}
                />
              </label>
            </li>
          )}
        </ul>
      );
    case "air_conditioner":
      return (
        <ul>
          <li>
            <label>
              Temperature:{" "}
              <NumberInput
                initValue={parameters.temperature}
                min={MIN_AC_TEMP}
                max={MAX_AC_TEMP}
                onSave={(newTemperature) => {
                  onSave({
                    temperature: newTemperature,
                  });
                }}
                disabled={disabled}
              />
            </label>
          </li>
          <li>
            <Select
              label="Mode: "
              options={[
                { label: "Cooling", value: "cool" },
                { label: "Heating", value: "heat" },
                { label: "Fan", value: "fan" },
              ]}
              value={parameters.mode}
              onChange={(newMode) => {
                onSave({
                  mode: newMode,
                });
              }}
              disabled={disabled}
            />
          </li>
          <li>
            <Select
              label="Fan: "
              options={[
                { label: "Off", value: "off" },
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
              ]}
              value={parameters.fan_speed}
              onChange={(newFanSpeed) => {
                onSave({
                  fan_speed: newFanSpeed,
                });
              }}
              disabled={disabled}
            />
          </li>
          <li>
            <Select
              label="Swing: "
              options={[
                { label: "Off", value: "off" },
                { label: "On", value: "on" },
                { label: "Auto", value: "auto" },
              ]}
              value={parameters.swing}
              onChange={(newSwing) => {
                onSave({
                  swing: newSwing,
                });
              }}
              disabled={disabled}
            />
          </li>
        </ul>
      );
    case "door_lock":
      return (
        <ul>
          <li>
            <label>
              Auto-lock enabled:
              <input
                disabled={disabled}
                type="checkbox"
                checked={parameters.auto_lock_enabled}
                readOnly={true}
              />
            </label>
          </li>
          <li>{`Battery level: ${parameters.battery_level}`}</li>
        </ul>
      );
    case "curtain":
      return (
        <ul>
          <li>{`Position: ${parameters.position}`}</li>
        </ul>
      );
    default:
      return <p>Unknown device type</p>;
  }
}
