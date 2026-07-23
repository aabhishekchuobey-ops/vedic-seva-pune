import AccessControl "mo:caffeineai-authorization/access-control";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/payment";
import PriestTypes "../types/priest-services";
import PaymentLib "../lib/payment";

// Public API surface for the payment domain.
// Reads from / writes to the stable state passed in from main.mo. Shares the
// bookings list and siteConfig with the priest-services mixin so donations are
// stored as Booking records and UPI config lives on SiteConfig. siteConfig is
// wrapped in a mutable record so updates from this mixin propagate back to the
// shared actor field.
mixin (
  bookings : List.List<PriestTypes.Booking>,
  siteConfig : { var value : ?PriestTypes.SiteConfig },
  idCounters : PriestTypes.IdCounters,
  accessControlState : AccessControl.AccessControlState,
) {
  // Create a new donation as a Booking with bookingCategory #donation and
  // paymentStatus #pendingVerification. Returns the created booking.
  public shared func createDonation(
    donorName : Text,
    donorPhone : Text,
    amount : Nat,
    donorMessage : ?Types.BilingualText,
    paymentReferenceId : ?Text,
  ) : async PriestTypes.Booking {
    let id = idCounters.nextBookingId;
    idCounters.nextBookingId := id + 1;
    let input : Types.DonationInput = {
      donorName;
      donorPhone;
      amount;
      donorMessage;
      paymentReferenceId;
    };
    let booking = PaymentLib.buildDonationBooking(input, id, Time.now().toNat());
    bookings.add(booking);
    booking;
  };

  // Return all bookings whose phone matches the given number — for the
  // my-bookings lookup. Public query so donors can find their bookings by phone.
  public query func getBookingsByPhone(phone : Text) : async [PriestTypes.Booking] {
    PaymentLib.filterBookingsByPhone(bookings.toArray(), phone);
  };

  // Admin-only: update the payment status of a booking by id. Must verify the
  // caller is an admin via AccessControl.isAdmin (the same check that powers
  // isCallerAdmin in MixinAuthorization). Returns the updated booking, or
  // null if not found.
  public shared ({ caller }) func updateBookingPaymentStatus(
    bookingId : Nat,
    newStatus : PriestTypes.PaymentStatus,
  ) : async ?PriestTypes.Booking {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    let found = bookings.find(func(b : PriestTypes.Booking) : Bool { b.id == bookingId });
    switch (found) {
      case null null;
      case (?b) {
        let updated : PriestTypes.Booking = { b with paymentStatus = ?newStatus };
        bookings.mapInPlace(func(existing : PriestTypes.Booking) : PriestTypes.Booking {
          if (existing.id == bookingId) { updated } else { existing };
        });
        ?updated;
      };
    };
  };

  // Admin-only: update the UPI fields of the site config. Must verify the caller
  // is an admin via AccessControl.isAdmin. Returns the updated site config, or
  // null if no site config exists yet.
  public shared ({ caller }) func updateSiteConfig(
    upiVPA : Text,
    upiPayeeName : Text,
    upiNote : Text,
  ) : async ?PriestTypes.SiteConfig {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    switch (siteConfig.value) {
      case null null;
      case (?config) {
        let updated : PriestTypes.SiteConfig = {
          config with
          upiVPA = ?upiVPA;
          upiPayeeName = ?upiPayeeName;
          upiNote = ?upiNote;
        };
        siteConfig.value := ?updated;
        ?updated;
      };
    };
  };
};
