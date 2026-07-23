// OQL _toRow instance for BilingualText. Collapses the {hi, en} record to a
// single #text Value using the Hindi (Devanagari) field — the default language
// per project preferences. Keeps every BilingualText-bearing entity on the
// auto-derive path; imported top-level in main.mo so the resolver finds it.
import Types "mo:caffeineai-oql/Types";
import Common "../types/common";

module {
  type Value = Types.Value;

  public func _toRow(self : Common.BilingualText) : Value = #text(self.hi);
};
