import OQL "mo:caffeineai-oql";
import Types "../types/priest-services";

// OQL _toRow for PaymentStatus — collapses the variant to a stable tag text
// so the booking entity's paymentStatus column is queryable.
module {
  public func _toRow(self : Types.PaymentStatus) : OQL.Value {
    #text(
      switch self {
        case (#pendingVerification) "pendingVerification";
        case (#verified) "verified";
        case (#failed) "failed";
        case (#notApplicable) "notApplicable";
      }
    );
  };
};
