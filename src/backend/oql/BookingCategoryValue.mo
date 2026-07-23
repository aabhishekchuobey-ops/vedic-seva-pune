import OQL "mo:caffeineai-oql";
import Types "../types/priest-services";

// OQL _toRow for BookingCategory — collapses the variant to a stable tag text
// so the booking entity's bookingCategory column is queryable.
module {
  public func _toRow(self : Types.BookingCategory) : OQL.Value {
    #text(
      switch self {
        case (#booking) "booking";
        case (#donation) "donation";
      }
    );
  };
};
