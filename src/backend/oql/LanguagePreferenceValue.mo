// OQL _toRow instance for the LanguagePreference variant. Renders the active
// arm as #text so it is queryable with exact literals. Imported top-level in
// main.mo so the auto-derive resolver finds it.
import Types "mo:caffeineai-oql/Types";
import Common "../types/common";

module {
  type Value = Types.Value;

  public func _toRow(self : Common.LanguagePreference) : Value = #text(
    switch self {
      case (#hindi) "hindi";
      case (#english) "english";
      case (#bilingual) "bilingual";
    }
  );
};
