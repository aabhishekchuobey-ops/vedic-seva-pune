import Common "common";
import PriestServices "priest-services";

module {
  // Payment-domain types. These are re-exported from priest-services so the
  // payment domain can reference them without duplicating definitions.
  public type BilingualText = Common.BilingualText;
  public type PaymentStatus = PriestServices.PaymentStatus;
  public type BookingCategory = PriestServices.BookingCategory;
  public type Booking = PriestServices.Booking;
  public type SiteConfig = PriestServices.SiteConfig;

  // Input for the createDonation endpoint.
  public type DonationInput = {
    donorName : Text;
    donorPhone : Text;
    amount : Nat;
    donorMessage : ?BilingualText;
    paymentReferenceId : ?Text;
  };

  // Input for the admin updateSiteConfig endpoint — only the UPI fields are
  // mutable through this endpoint; the rest of SiteConfig is seeded via migration.
  public type SiteConfigUpdate = {
    upiVPA : Text;
    upiPayeeName : Text;
    upiNote : Text;
  };
};
