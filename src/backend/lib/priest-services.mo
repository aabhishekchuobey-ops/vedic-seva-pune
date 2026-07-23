import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Types "../types/priest-services";

// Domain logic for the priest-services domain.
// Stateless helpers operating on passed-in collections — the mixin owns the
// stable state and delegates sorting/filtering here where reuse is helpful.
module {
  public type Service = Types.Service;
  public type Package = Types.Package;
  public type Booking = Types.Booking;
  public type GalleryItem = Types.GalleryItem;
  public type Review = Types.Review;
  public type BlogPost = Types.BlogPost;
  public type FAQ = Types.FAQ;
  public type ContactSubmission = Types.ContactSubmission;
  public type ServiceArea = Types.ServiceArea;
  public type SiteConfig = Types.SiteConfig;
  public type ServiceCategory = Types.ServiceCategory;

  // Sort services by displayOrder ascending.
  public func sortServicesByDisplayOrder(items : [Service]) : [Service] {
    Array.sort<Service>(
      items,
      func(a : Service, b : Service) : Order.Order =
        Nat.compare(a.displayOrder, b.displayOrder);
    );
  };

  // Filter services by category.
  public func filterServicesByCategory(items : [Service], category : ServiceCategory) : [Service] {
    Array.filter<Service>(
      items,
      func(s : Service) : Bool {
        switch (category, s.category) {
          case (#vedicPujaHavan, #vedicPujaHavan) true;
          case (#grahaDoshShanti, #grahaDoshShanti) true;
          case (#jeevanSamskar, #jeevanSamskar) true;
          case (#jyotishServices, #jyotishServices) true;
          case (_) false;
        };
      },
    );
  };

  // Find a service by id.
  public func findService(items : [Service], id : Nat) : ?Service {
    Array.find<Service>(items, func(s : Service) : Bool { s.id == id });
  };

  // Sort packages by displayOrder ascending.
  public func sortPackagesByDisplayOrder(items : [Package]) : [Package] {
    Array.sort<Package>(
      items,
      func(a : Package, b : Package) : Order.Order =
        Nat.compare(a.displayOrder, b.displayOrder);
    );
  };

  // Pass-through: return bookings as-is (ordering is insertion order).
  public func listBookings(items : [Booking]) : [Booking] {
    items;
  };

  // Sort gallery items by createdAt descending (newest first).
  public func sortGalleryByCreatedDesc(items : [GalleryItem]) : [GalleryItem] {
    Array.sort<GalleryItem>(
      items,
      func(a : GalleryItem, b : GalleryItem) : Order.Order =
        Nat.compare(b.createdAt, a.createdAt);
    );
  };

  // Sort reviews by createdAt descending (newest first).
  public func sortReviewsByCreatedDesc(items : [Review]) : [Review] {
    Array.sort<Review>(
      items,
      func(a : Review, b : Review) : Order.Order =
        Nat.compare(b.createdAt, a.createdAt);
    );
  };

  // Filter to published blog posts, sorted by createdAt descending.
  public func publishedBlogPosts(items : [BlogPost]) : [BlogPost] {
    let published = Array.filter<BlogPost>(items, func(p : BlogPost) : Bool { p.published });
    Array.sort<BlogPost>(
      published,
      func(a : BlogPost, b : BlogPost) : Order.Order =
        Nat.compare(b.createdAt, a.createdAt);
    );
  };

  // Find a published blog post by slug.
  public func findPublishedBlogPost(items : [BlogPost], slug : Text) : ?BlogPost {
    Array.find<BlogPost>(
      items,
      func(p : BlogPost) : Bool { p.published and p.slug == slug };
    );
  };

  // Sort FAQs by displayOrder ascending.
  public func sortFAQsByDisplayOrder(items : [FAQ]) : [FAQ] {
    Array.sort<FAQ>(
      items,
      func(a : FAQ, b : FAQ) : Order.Order =
        Nat.compare(a.displayOrder, b.displayOrder);
    );
  };

  // Pass-through: return contact submissions as-is.
  public func listContactSubmissions(items : [ContactSubmission]) : [ContactSubmission] {
    items;
  };

  // Pass-through: return service areas as-is.
  public func listServiceAreas(items : [ServiceArea]) : [ServiceArea] {
    items;
  };

  // Return the site config if set.
  public func getSiteConfig(config : ?SiteConfig) : ?SiteConfig {
    config;
  };
};
