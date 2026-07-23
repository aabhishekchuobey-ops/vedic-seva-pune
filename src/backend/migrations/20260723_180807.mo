import List "mo:core/List";
import Map "mo:core/Map";
import Storage "mo:caffeineai-object-storage/Storage";
import AccessControl "mo:caffeineai-authorization/access-control";

// Migration adding payment support to the priest-services actor.
// OldActor matches the NewActor of the preceding migration (20260723_174336).
// NewActor extends Booking with optional payment fields and SiteConfig with
// optional UPI fields. Existing bookings/configs get null/defaults so they
// remain valid; the siteConfig seed is updated with a 9026828075-linked VPA.
module {
  // ---- Old types (priest-services pre-payment, inlined) ----
  type BilingualText = { hi : Text; en : Text };

  type ServiceCategory = {
    #vedicPujaHavan;
    #grahaDoshShanti;
    #jeevanSamskar;
    #jyotishServices;
  };

  type LanguagePreference = {
    #hindi;
    #english;
    #bilingual;
  };

  type OldBooking = {
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
    createdAt : Nat;
  };

  type OldService = {
    id : Nat;
    category : ServiceCategory;
    name : BilingualText;
    description : BilingualText;
    displayOrder : Nat;
  };

  type OldPackage = {
    id : Nat;
    name : BilingualText;
    priceMinRupees : Nat;
    priceMaxRupees : Nat;
    includedItems : [BilingualText];
    description : BilingualText;
    displayOrder : Nat;
  };

  type OldGalleryItem = {
    id : Nat;
    image : Storage.ExternalBlob;
    title : BilingualText;
    category : Text;
    createdAt : Nat;
  };

  type OldReview = {
    id : Nat;
    reviewerName : Text;
    rating : Nat;
    testimonial : BilingualText;
    createdAt : Nat;
  };

  type OldBlogPost = {
    id : Nat;
    title : BilingualText;
    excerpt : BilingualText;
    content : BilingualText;
    image : ?Storage.ExternalBlob;
    slug : Text;
    published : Bool;
    createdAt : Nat;
  };

  type OldFAQ = {
    id : Nat;
    question : BilingualText;
    answer : BilingualText;
    category : Text;
    displayOrder : Nat;
  };

  type OldContactSubmission = {
    id : Nat;
    name : Text;
    phone : Text;
    message : Text;
    createdAt : Nat;
  };

  type OldServiceArea = {
    id : Nat;
    name : Text;
  };

  type OldSocialLink = {
    name : Text;
    url : Text;
  };

  type OldSiteConfig = {
    panditName : BilingualText;
    tagline : BilingualText;
    contactPhone : Text;
    socialLinks : [OldSocialLink];
    sankalp : BilingualText;
  };

  type OldIdCounters = {
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

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    services : List.List<OldService>;
    packages : List.List<OldPackage>;
    bookings : List.List<OldBooking>;
    gallery : List.List<OldGalleryItem>;
    reviews : List.List<OldReview>;
    blogPosts : List.List<OldBlogPost>;
    faqs : List.List<OldFAQ>;
    contactSubmissions : List.List<OldContactSubmission>;
    serviceAreas : List.List<OldServiceArea>;
    siteConfig : ?OldSiteConfig;
    idCounters : OldIdCounters;
  };

  // ---- New types (priest-services with payment, inlined) ----
  type PaymentStatus = {
    #pendingVerification;
    #verified;
    #failed;
    #notApplicable;
  };

  type BookingCategory = {
    #booking;
    #donation;
  };

  type NewBooking = {
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
    createdAt : Nat;
    upiVPA : ?Text;
    advanceAmount : ?Nat;
    paymentStatus : ?PaymentStatus;
    paymentReferenceId : ?Text;
    bookingCategory : ?BookingCategory;
    donorMessage : ?BilingualText;
  };

  type NewService = OldService;
  type NewPackage = OldPackage;
  type NewGalleryItem = OldGalleryItem;
  type NewReview = OldReview;
  type NewBlogPost = OldBlogPost;
  type NewFAQ = OldFAQ;
  type NewContactSubmission = OldContactSubmission;
  type NewServiceArea = OldServiceArea;
  type NewSocialLink = OldSocialLink;

  type NewSiteConfig = {
    panditName : BilingualText;
    tagline : BilingualText;
    contactPhone : Text;
    socialLinks : [NewSocialLink];
    sankalp : BilingualText;
    upiVPA : ?Text;
    upiPayeeName : ?Text;
    upiNote : ?Text;
  };

  type NewIdCounters = OldIdCounters;

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    services : List.List<NewService>;
    packages : List.List<NewPackage>;
    bookings : List.List<NewBooking>;
    gallery : List.List<NewGalleryItem>;
    reviews : List.List<NewReview>;
    blogPosts : List.List<NewBlogPost>;
    faqs : List.List<NewFAQ>;
    contactSubmissions : List.List<NewContactSubmission>;
    serviceAreas : List.List<NewServiceArea>;
    siteConfig : { var value : ?NewSiteConfig };
    idCounters : NewIdCounters;
  };

  // Upgrade an old booking to the new shape — payment fields default to null
  // so existing bookings remain valid. bookingCategory defaults to #booking.
  func upgradeBooking(old : OldBooking) : NewBooking {
    {
      id = old.id;
      name = old.name;
      phone = old.phone;
      email = old.email;
      serviceType = old.serviceType;
      preferredDate = old.preferredDate;
      preferredTime = old.preferredTime;
      address = old.address;
      languagePreference = old.languagePreference;
      specialNotes = old.specialNotes;
      createdAt = old.createdAt;
      upiVPA = null;
      advanceAmount = null;
      paymentStatus = ?#notApplicable;
      paymentReferenceId = null;
      bookingCategory = ?#booking;
      donorMessage = null;
    };
  };

  // Upgrade an old site config to the new shape, seeding the UPI fields with a
  // 9026828075-linked VPA. If no site config existed, return null.
  func upgradeSiteConfig(old : ?OldSiteConfig) : ?NewSiteConfig {
    switch old {
      case null null;
      case (?c) ?{
        panditName = c.panditName;
        tagline = c.tagline;
        contactPhone = c.contactPhone;
        socialLinks = c.socialLinks;
        sankalp = c.sankalp;
        upiVPA = ?"9026828075@okbiz";
        upiPayeeName = ?"Pandit Ji";
        upiNote = ?"Daan / Seva / Puja booking";
      };
    };
  };

  public func migration(old : OldActor) : NewActor {
    // Upgrade all bookings to the new shape with defaulted payment fields.
    let newBookings = List.empty<NewBooking>();
    for (b in old.bookings.toArray().vals()) {
      newBookings.add(upgradeBooking(b));
    };

    {
      accessControlState = old.accessControlState;
      services = old.services;
      packages = old.packages;
      bookings = newBookings;
      gallery = old.gallery;
      reviews = old.reviews;
      blogPosts = old.blogPosts;
      faqs = old.faqs;
      contactSubmissions = old.contactSubmissions;
      serviceAreas = old.serviceAreas;
      siteConfig = { var value = upgradeSiteConfig(old.siteConfig) };
      idCounters = old.idCounters;
    };
  };
};
