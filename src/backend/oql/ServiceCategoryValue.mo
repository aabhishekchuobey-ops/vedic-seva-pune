// OQL _toRow instance for the ServiceCategory variant. Renders the active arm
// as #text so it is queryable with exact literals (eq value "vedicPujaHavan").
// Imported top-level in main.mo so the auto-derive resolver finds it.
import Types "mo:caffeineai-oql/Types";
import Common "../types/common";

module {
  type Value = Types.Value;

  public func _toRow(self : Common.ServiceCategory) : Value = #text(
    switch self {
      case (#vedicPujaHavan) "vedicPujaHavan";
      case (#grahaDoshShanti) "grahaDoshShanti";
      case (#jeevanSamskar) "jeevanSamskar";
      case (#jyotishServices) "jyotishServices";
    }
  );
};
