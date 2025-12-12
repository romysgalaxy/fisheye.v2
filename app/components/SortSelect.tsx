"use client";

type SortValue = "popularity" | "date" | "title";

type Props = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

export default function SortSelect({ value, onChange }: Props) {
  return (
    <div className="sort">
      <label className="sort__label" htmlFor="sort-select">
        Trier par
      </label>

      <select
        id="sort-select"
        className="sort__select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortValue)}
      >
        <option value="popularity">Popularité</option>
        <option value="date">Date</option>
        <option value="title">Titre</option>
      </select>
    </div>
  );
}