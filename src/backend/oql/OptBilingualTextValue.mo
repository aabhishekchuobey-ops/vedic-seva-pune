import OQL "mo:caffeineai-oql";
import Common "../types/common";

// OQL _toRow for ?BilingualText — option → sentinel. Null collapses to an
// empty record-shaped text so the column type stays stable across rows.
module {
  public func _toRow(self : ?Common.BilingualText) : OQL.Value {
    switch self {
      case null #text("");
      case (?bt) #text(bt.hi # " / " # bt.en);
    };
  };
};
