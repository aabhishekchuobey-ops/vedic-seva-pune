import Types "../types/payment";

// Domain logic for the payment domain.
// Stateless helpers operating on passed-in collections — the mixin owns the
// stable state and delegates filtering/lookup here where reuse is helpful.
module {
  public type Booking = Types.Booking;
  public type PaymentStatus = Types.PaymentStatus;
  public type DonationInput = Types.DonationInput;

  // Filter bookings by phone number — used by the my-bookings lookup.
  // Returns every booking whose `phone` field exactly matches the given phone.
  public func filterBookingsByPhone(items : [Booking], phone : Text) : [Booking] {
    items.filter(func(b : Booking) : Bool { b.phone == phone });
  };

  // Build a donation Booking record from a DonationInput, assigning the given
  // id and timestamp, with bookingCategory #donation and paymentStatus
  // #pendingVerification. Donation bookings do not carry service-specific
  // fields; name/phone come from the donor, serviceType is fixed to "Donation".
  public func buildDonationBooking(input : DonationInput, id : Nat, createdAt : Nat) : Booking {
    {
      id;
      name = input.donorName;
      phone = input.donorPhone;
      email = null;
      serviceType = "Donation";
      preferredDate = "";
      preferredTime = "";
      address = "";
      languagePreference = #hindi;
      specialNotes = "";
      createdAt;
      upiVPA = null;
      advanceAmount = ?input.amount;
      paymentStatus = ?#pendingVerification;
      paymentReferenceId = input.paymentReferenceId;
      bookingCategory = ?#donation;
      donorMessage = input.donorMessage;
    };
  };
};
