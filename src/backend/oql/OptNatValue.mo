import OQL "mo:caffeineai-oql";

// OQL _toRow for ?Nat — option → sentinel. Null collapses to 0 so the column
// type stays stable across rows and remains queryable.
module {
  public func _toRow(self : ?Nat) : OQL.Value {
    switch self {
      case null #nat(0);
      case (?n) #nat(n);
    };
  };
};
