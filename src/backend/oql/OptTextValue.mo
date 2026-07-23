// OQL _toRow instance for ?Text. Options have no built-in _toRow; a null and a
// present value must collapse to the SAME Value variant so the schema type does
// not flip-flop by row order. Sentinel "" represents null — queryable with
// `eq value ""`. Imported top-level in main.mo so the resolver finds it.
import Types "mo:caffeineai-oql/Types";

module {
  type Value = Types.Value;

  public func _toRow(self : ?Text) : Value = switch self {
    case null #text("");
    case (?t) #text(t);
  };
};
