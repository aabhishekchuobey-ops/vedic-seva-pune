import OQL "mo:caffeineai-oql";
import BookingCategoryValue "BookingCategoryValue";
import Types "../types/priest-services";

// OQL _toRow for ?BookingCategory — option → sentinel. Null collapses to the
// "booking" tag text so the column type stays stable across rows.
module {
  public func _toRow(self : ?Types.BookingCategory) : OQL.Value {
    switch self {
      case null #text("booking");
      case (?bc) bc._toRow();
    };
  };
};
