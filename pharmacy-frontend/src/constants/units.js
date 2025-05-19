export const UNIT_TYPES = [
  { value: "unit", label: "Unit", singular: true },
  { value: "bottle", label: "Bottle", singular: true },
  { value: "blister", label: "Blister", singular: false },
  { value: "box", label: "Box", singular: false },
  { value: "packet", label: "Packet", singular: false },
  { value: "tube", label: "Tube", singular: true },
];

export const INVALID_NESTING = {
  bottle: ["bottle"],
  tube: ["tube"],
  unit: ["bottle", "blister", "box", "packet", "tube"],
};
