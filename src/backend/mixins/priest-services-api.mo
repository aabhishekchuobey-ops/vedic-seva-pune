import AccessControl "mo:caffeineai-authorization/access-control";
import Array "mo:core/Array";
import Int "mo:core/Int";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/priest-services";

// Public API surface for the priest-services domain.
// Reads from / writes to the stable state passed in from main.mo.
mixin (
  services : List.List<Types.Service>,
  packages : List.List<Types.Package>,
  bookings : List.List<Types.Booking>,
  gallery : List.List<Types.GalleryItem>,
  reviews : List.List<Types.Review>,
  blogPosts : List.List<Types.BlogPost>,
  faqs : List.List<Types.FAQ>,
  contactSubmissions : List.List<Types.ContactSubmission>,
  serviceAreas : List.List<Types.ServiceArea>,
  siteConfig : { var value : ?Types.SiteConfig },
  idCounters : Types.IdCounters,
  accessControlState : AccessControl.AccessControlState,
) {

  // Return all services sorted by displayOrder ascending.
  public query func getServices() : async [Types.Service] {
    services.toArray().sort(
      func(a : Types.Service, b : Types.Service) : Order.Order =
        Nat.compare(a.displayOrder, b.displayOrder),
    );
  };

  // Return services filtered by category, sorted by displayOrder ascending.
  public query func getServicesByCategory(category : Types.ServiceCategory) : async [Types.Service] {
    let filtered = services
      .filter(func(s : Types.Service) : Bool {
        switch (category, s.category) {
          case (#vedicPujaHavan, #vedicPujaHavan) true;
          case (#grahaDoshShanti, #grahaDoshShanti) true;
          case (#jeevanSamskar, #jeevanSamskar) true;
          case (#jyotishServices, #jyotishServices) true;
          case (_) false;
        };
      })
      .toArray();
    filtered.sort(
      func(a : Types.Service, b : Types.Service) : Order.Order =
        Nat.compare(a.displayOrder, b.displayOrder),
    );
  };

  // Find a single service by id.
  public query func getService(id : Nat) : async ?Types.Service {
    services.find(func(s : Types.Service) : Bool { s.id == id });
  };

  // Return all packages sorted by displayOrder ascending.
  public query func getPackages() : async [Types.Package] {
    packages.toArray().sort(
      func(a : Types.Package, b : Types.Package) : Order.Order =
        Nat.compare(a.displayOrder, b.displayOrder),
    );
  };

  // Return all bookings. Admin-only — bookings carry PII (names, phones,
  // payment references, donor messages). Verifies the caller is an admin via
  // AccessControl.isAdmin (the same check that powers isCallerAdmin in
  // MixinAuthorization). Traps if the caller is not an admin.
  public shared ({ caller }) func getBookings() : async [Types.Booking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    bookings.toArray();
  };

  // Create a new booking with a generated id and timestamp, append to the
  // bookings list, and return the created booking. The new payment fields are
  // optional so existing callers (and the frontend) keep working unchanged.
  public shared func createBooking(
    name : Text,
    phone : Text,
    email : ?Text,
    serviceType : Text,
    preferredDate : Text,
    preferredTime : Text,
    address : Text,
    languagePreference : Types.LanguagePreference,
    specialNotes : Text,
    upiVPA : ?Text,
    advanceAmount : ?Nat,
    paymentStatus : ?Types.PaymentStatus,
    paymentReferenceId : ?Text,
    bookingCategory : ?Types.BookingCategory,
    donorMessage : ?Types.BilingualText,
  ) : async Types.Booking {
    let id = idCounters.nextBookingId;
    idCounters.nextBookingId := id + 1;
    let booking : Types.Booking = {
      id;
      name;
      phone;
      email;
      serviceType;
      preferredDate;
      preferredTime;
      address;
      languagePreference;
      specialNotes;
      createdAt = Time.now().toNat();
      upiVPA;
      advanceAmount;
      paymentStatus;
      paymentReferenceId;
      bookingCategory;
      donorMessage;
    };
    bookings.add(booking);
    booking;
  };

  // Return all gallery items sorted by createdAt descending (newest first).
  public query func getGallery() : async [Types.GalleryItem] {
    gallery.toArray().sort(
      func(a : Types.GalleryItem, b : Types.GalleryItem) : Order.Order =
        Nat.compare(b.createdAt, a.createdAt)
    );
  };

  // Return all reviews sorted by createdAt descending (newest first).
  public query func getReviews() : async [Types.Review] {
    reviews.toArray().sort(
      func(a : Types.Review, b : Types.Review) : Order.Order =
        Nat.compare(b.createdAt, a.createdAt)
    );
  };

  // Create a new review with a generated id and timestamp, append to the
  // reviews list, and return it.
  public shared func createReview(
    reviewerName : Text,
    rating : Nat,
    testimonial : Types.BilingualText,
  ) : async Types.Review {
    let id = idCounters.nextReviewId;
    idCounters.nextReviewId := id + 1;
    let review : Types.Review = {
      id;
      reviewerName;
      rating;
      testimonial;
      createdAt = Time.now().toNat();
    };
    reviews.add(review);
    review;
  };

  // Return all published blog posts sorted by createdAt descending.
  public query func getBlogPosts() : async [Types.BlogPost] {
    let published = blogPosts
      .filter(func(p : Types.BlogPost) : Bool { p.published })
      .toArray();
    published.sort(
      func(a : Types.BlogPost, b : Types.BlogPost) : Order.Order =
        Nat.compare(b.createdAt, a.createdAt)
    );
  };

  // Find a published blog post by slug.
  public query func getBlogPost(slug : Text) : async ?Types.BlogPost {
    blogPosts.find(func(p : Types.BlogPost) : Bool {
      p.published and p.slug == slug;
    });
  };

  // Return all FAQs sorted by displayOrder ascending.
  public query func getFAQs() : async [Types.FAQ] {
    faqs.toArray().sort(
      func(a : Types.FAQ, b : Types.FAQ) : Order.Order =
        Nat.compare(a.displayOrder, b.displayOrder)
    );
  };

  // Return all contact submissions. Admin-only — submissions carry PII (names,
  // phones, messages). Verifies the caller is an admin via AccessControl.isAdmin
  // (the same check that powers isCallerAdmin in MixinAuthorization). Traps if
  // the caller is not an admin.
  public shared ({ caller }) func getContactSubmissions() : async [Types.ContactSubmission] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    contactSubmissions.toArray();
  };

  // Create a new contact submission with a generated id and timestamp, append
  // to the list, and return it.
  public shared func createContactSubmission(
    name : Text,
    phone : Text,
    message : Text,
  ) : async Types.ContactSubmission {
    let id = idCounters.nextContactSubmissionId;
    idCounters.nextContactSubmissionId := id + 1;
    let submission : Types.ContactSubmission = {
      id;
      name;
      phone;
      message;
      createdAt = Time.now().toNat();
    };
    contactSubmissions.add(submission);
    submission;
  };

  // Return all service areas.
  public query func getServiceAreas() : async [Types.ServiceArea] {
    serviceAreas.toArray();
  };

  // Return the site config if one has been set.
  public query func getSiteConfig() : async ?Types.SiteConfig {
    siteConfig.value;
  };
};
