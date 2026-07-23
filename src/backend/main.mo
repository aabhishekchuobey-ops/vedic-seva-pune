import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Storage "mo:caffeineai-object-storage/Storage";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import ListEntity "mo:caffeineai-oql/ListEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import IntValue "mo:caffeineai-oql/IntValue";
import Entity "mo:caffeineai-oql/Entity";
import TextValue "mo:caffeineai-oql/TextValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import BlobValue "mo:caffeineai-oql/BlobValue";

// OQL _toRow instances for non-primitive fields. Imported top-level so the
// auto-derive resolver finds them (it does not walk submodules). Each collapses
// a nested/variant/option type to a single OQL.Value with a stable sentinel.
import BilingualTextValue "oql/BilingualTextValue";
import ServiceCategoryValue "oql/ServiceCategoryValue";
import LanguagePreferenceValue "oql/LanguagePreferenceValue";
import OptTextValue "oql/OptTextValue";
import OptBlobValue "oql/OptBlobValue";
import PaymentStatusValue "oql/PaymentStatusValue";
import BookingCategoryValue "oql/BookingCategoryValue";
import OptBilingualTextValue "oql/OptBilingualTextValue";
import OptNatValue "oql/OptNatValue";
import OptPaymentStatusValue "oql/OptPaymentStatusValue";
import OptBookingCategoryValue "oql/OptBookingCategoryValue";

import Common "types/common";
import Types "types/priest-services";
import PriestServicesApi "mixins/priest-services-api";
import PaymentApi "mixins/payment-api";

actor {
  // Authorization + object storage infrastructure (preserved from template).
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);
  include MixinObjectStorage();

  // Priest-services stable state. Initial values come from the migration chain.
  let services : List.List<Types.Service>;
  let packages : List.List<Types.Package>;
  let bookings : List.List<Types.Booking>;
  let gallery : List.List<Types.GalleryItem>;
  let reviews : List.List<Types.Review>;
  let blogPosts : List.List<Types.BlogPost>;
  let faqs : List.List<Types.FAQ>;
  let contactSubmissions : List.List<Types.ContactSubmission>;
  let serviceAreas : List.List<Types.ServiceArea>;
  let siteConfig : { var value : ?Types.SiteConfig };
  let idCounters : Types.IdCounters;

  // Public API surface for the priest-services domain.
  include PriestServicesApi(
    services,
    packages,
    bookings,
    gallery,
    reviews,
    blogPosts,
    faqs,
    contactSubmissions,
    serviceAreas,
    siteConfig,
    idCounters,
    accessControlState,
  );

  // Public API surface for the payment domain. Shares the bookings list,
  // siteConfig, and idCounters with the priest-services mixin so donations are
  // stored as Booking records and UPI config lives on SiteConfig.
  include PaymentApi(bookings, siteConfig, idCounters, accessControlState);

  // OQL — Data Intelligence. Expose all primary stored collections so they are
  // queryable in natural language. Public catalogue entities are world-readable;
  // customer-submitted data (bookings, contact submissions) is controller-only.
  include Expose({
    entities = [
      services.toEntity("service", "Service", "id")
        .sample({
          id = 0;
          category = #vedicPujaHavan;
          name = { hi = ""; en = "" };
          description = { hi = ""; en = "" };
          displayOrder = 0;
        })
        .public_()
        .build(),
      // Package carries a collection field (includedItems : [BilingualText]),
      // so it cannot auto-derive — manual mode with per-field .payload. Each
      // BilingualText collapses to its Hindi text; includedItems joins the
      // Hindi labels with ", " so the package is still queryable.
      packages.toEntityManual("package", "Package", "id")
        .sample({
          id = 0;
          name = { hi = ""; en = "" };
          priceMinRupees = 0;
          priceMaxRupees = 0;
          includedItems = [];
          description = { hi = ""; en = "" };
          displayOrder = 0;
        })
        .payload("id", func(p : Types.Package) : Nat = p.id)
        .payload("name", func(p : Types.Package) : Common.BilingualText = p.name)
        .payload("priceMinRupees", func(p : Types.Package) : Nat = p.priceMinRupees)
        .payload("priceMaxRupees", func(p : Types.Package) : Nat = p.priceMaxRupees)
        .payload("includedItems", func(p : Types.Package) : Text =
          p.includedItems.map(func(b : Common.BilingualText) : Text = b.hi)
            .vals().join(", "))
        .payload("description", func(p : Types.Package) : Common.BilingualText = p.description)
        .payload("displayOrder", func(p : Types.Package) : Nat = p.displayOrder)
        .public_()
        .build(),
      bookings.toEntity("booking", "Booking", "id")
        .sample({
          id = 0;
          name = "";
          phone = "";
          email = null;
          serviceType = "";
          preferredDate = "";
          preferredTime = "";
          address = "";
          languagePreference = #hindi;
          specialNotes = "";
          createdAt = 0;
          upiVPA = null;
          advanceAmount = null;
          paymentStatus = null;
          paymentReferenceId = null;
          bookingCategory = null;
          donorMessage = null;
        })
        .controllerOnly()
        .build(),
      gallery.toEntity("galleryItem", "GalleryItem", "id")
        .sample({
          id = 0;
          image = "" : Storage.ExternalBlob;
          title = { hi = ""; en = "" };
          category = "";
          createdAt = 0;
        })
        .public_()
        .build(),
      reviews.toEntity("review", "Review", "id")
        .sample({
          id = 0;
          reviewerName = "";
          rating = 0;
          testimonial = { hi = ""; en = "" };
          createdAt = 0;
        })
        .public_()
        .build(),
      blogPosts.toEntity("blogPost", "BlogPost", "id")
        .sample({
          id = 0;
          title = { hi = ""; en = "" };
          excerpt = { hi = ""; en = "" };
          content = { hi = ""; en = "" };
          image = null;
          slug = "";
          published = false;
          createdAt = 0;
        })
        .public_()
        .build(),
      faqs.toEntity("faq", "FAQ", "id")
        .sample({
          id = 0;
          question = { hi = ""; en = "" };
          answer = { hi = ""; en = "" };
          category = "";
          displayOrder = 0;
        })
        .public_()
        .build(),
      contactSubmissions.toEntity("contactSubmission", "ContactSubmission", "id")
        .sample({
          id = 0;
          name = "";
          phone = "";
          message = "";
          createdAt = 0;
        })
        .controllerOnly()
        .build(),
      serviceAreas.toEntity("serviceArea", "ServiceArea", "id")
        .sample({ id = 0; name = "" })
        .public_()
        .build(),
      // Site-wide configuration. siteConfig is a single optional record (not a
      // collection), so it is exposed as a 0-or-1-row entity via manual mode.
      // The SiteConfig record carries a collection field (socialLinks), so each
      // field is projected with .payload. BilingualText fields collapse via
      // BilingualTextValue._toRow; the UPI ?Text fields collapse via
      // OptTextValue._toRow. Public-readable so visitors can render contact and
      // UPI payment details without admin access.
      Entity.manual<Types.SiteConfig>(
        "siteConfig",
        func() : Iter.Iter<Types.SiteConfig> {
          let config = siteConfig.value;
          switch config {
            case null Iter.empty();
            case (?c) Iter.singleton(c);
          };
        },
        "SiteConfig",
        "panditName",
      )
        .sample({
          panditName = { hi = ""; en = "" };
          tagline = { hi = ""; en = "" };
          contactPhone = "";
          socialLinks = [];
          sankalp = { hi = ""; en = "" };
          upiVPA = null;
          upiPayeeName = null;
          upiNote = null;
        })
        .payload("panditName", func(c : Types.SiteConfig) : Common.BilingualText = c.panditName)
        .payload("tagline", func(c : Types.SiteConfig) : Common.BilingualText = c.tagline)
        .payload("contactPhone", func(c : Types.SiteConfig) : Text = c.contactPhone)
        .payload("socialLinks", func(c : Types.SiteConfig) : Text =
          c.socialLinks.map(func(s : Types.SocialLink) : Text = s.name # ":" # s.url)
            .vals().join(", "))
        .payload("sankalp", func(c : Types.SiteConfig) : Common.BilingualText = c.sankalp)
        .payload("upiVPA", func(c : Types.SiteConfig) : ?Text = c.upiVPA)
        .payload("upiPayeeName", func(c : Types.SiteConfig) : ?Text = c.upiPayeeName)
        .payload("upiNote", func(c : Types.SiteConfig) : ?Text = c.upiNote)
        .public_()
        .build(),
    ];
  });
};
