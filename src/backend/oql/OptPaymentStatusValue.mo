import OQL "mo:caffeineai-oql";
import PaymentStatusValue "PaymentStatusValue";
import Types "../types/priest-services";

// OQL _toRow for ?PaymentStatus — option → sentinel. Null collapses to the
// "notApplicable" tag text so the column type stays stable across rows.
module {
  public func _toRow(self : ?Types.PaymentStatus) : OQL.Value {
    switch self {
      case null #text("notApplicable");
      case (?ps) ps._toRow();
    };
  };
};
