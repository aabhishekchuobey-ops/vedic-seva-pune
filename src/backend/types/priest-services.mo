import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type BilingualText = Common.BilingualText;
  public type ServiceCategory = Common.ServiceCategory;
  public type LanguagePreference = Common.LanguagePreference;
  public type Timestamp = Common.Timestamp;

  // A single service within a category, with bilingual name and description.
  public type Service = {
    id : Nat;
    category : ServiceCategory;
    name : BilingualText;
    description : BilingualText;
    displayOrder : Nat;
  };

  // A pricing package: name, price range in rupees, included items, bilingual description.
  public type Package = {
    id : Nat;
    name : BilingualText;
    priceMinRupees : Nat;
    priceMaxRupees : Nat;
    includedItems : [BilingualText];
    description : BilingualText;
    displayOrder : Nat;
  };

  // Status of an advance payment for a booking or donation.
  // #pendingVerification: donor has initiated UPI payment, awaiting admin confirmation.
  // #verified: admin confirmed receipt of payment.
  // #failed: payment did not complete or was rejected.
  // #notApplicable: no advance payment required (e.g. cash on service).
  public type PaymentStatus = {
    #pendingVerification;
    #verified;
    #failed;
    #notApplicable;
  };

  // Distinguishes a service booking from a free-form donation.
  public type BookingCategory = {
    #booking;
    #donation;
  };

  // A booking submission from a customer. Payment fields are optional so
  // existing bookings (created before payment support) remain valid.
  public type Booking = {
    id : Nat;
    name : Text;
    phone : Text;
    email : ?Text;
    serviceType : Text;
    preferredDate : Text;
    preferredTime : Text;
    address : Text;
    languagePreference : LanguagePreference;
    specialNotes : Text;
    createdAt : Timestamp;
    // Payment fields — all optional or defaulted so old bookings stay valid.
    upiVPA : ?Text;
    advanceAmount : ?Nat;
    paymentStatus : ?PaymentStatus;
    paymentReferenceId : ?Text;
    bookingCategory : ?BookingCategory;
    donorMessage : ?BilingualText;
  };

  // A gallery item: image reference via object storage, bilingual title, category.
  public type GalleryItem = {
    id : Nat;
    image : Storage.ExternalBlob;
    title : BilingualText;
    category : Text;
    createdAt : Timestamp;
  };

  // A customer review: reviewer name, 1-5 star rating, bilingual testimonial.
  public type Review = {
    id : Nat;
    reviewerName : Text;
    rating : Nat; // 1-5
    testimonial : BilingualText;
    createdAt : Timestamp;
  };

  // A blog post: bilingual title/excerpt/content, image, slug, published flag.
  public type BlogPost = {
    id : Nat;
    title : BilingualText;
    excerpt : BilingualText;
    content : BilingualText;
    image : ?Storage.ExternalBlob;
    slug : Text;
    published : Bool;
    createdAt : Timestamp;
  };

  // A frequently asked question with bilingual Q/A, category, display order.
  public type FAQ = {
    id : Nat;
    question : BilingualText;
    answer : BilingualText;
    category : Text;
    displayOrder : Nat;
  };

  // A contact form submission.
  public type ContactSubmission = {
    id : Nat;
    name : Text;
    phone : Text;
    message : Text;
    createdAt : Timestamp;
  };

  // A service area within Pune (or "All Pune").
  public type ServiceArea = {
    id : Nat;
    name : Text;
  };

  // Site-wide configuration: pandit identity, contact, social, sankalp, UPI.
  public type SiteConfig = {
    panditName : BilingualText;
    tagline : BilingualText;
    contactPhone : Text;
    socialLinks : [SocialLink];
    sankalp : BilingualText;
    // UPI payment details linked to 9026828075. Optional so old configs stay valid.
    upiVPA : ?Text;
    upiPayeeName : ?Text;
    upiNote : ?Text;
  };

  public type SocialLink = {
    name : Text;
    url : Text;
  };

  // Mutable counter record shared across mixins for ID generation.
  public type IdCounters = {
    var nextServiceId : Nat;
    var nextPackageId : Nat;
    var nextBookingId : Nat;
    var nextGalleryItemId : Nat;
    var nextReviewId : Nat;
    var nextBlogPostId : Nat;
    var nextFAQId : Nat;
    var nextContactSubmissionId : Nat;
    var nextServiceAreaId : Nat;
  };
};
