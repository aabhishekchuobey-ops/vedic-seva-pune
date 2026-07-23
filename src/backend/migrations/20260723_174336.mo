import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Storage "mo:caffeineai-object-storage/Storage";
import AccessControl "mo:caffeineai-authorization/access-control";

// Migration from the MicroBlog template actor to the priest-services actor.
// OldActor matches the NewActor of the preceding migration (20250101_000000_Init).
// NewActor enumerates every stable field declared in main.mo and seeds initial
// data for services, packages, FAQs, service areas, site config, and sample
// reviews/blog posts/gallery on a fresh install.
module {
  // ---- Old types (MicroBlog template, inlined) ----
  type OldUserProfile = {
    username : Text;
    displayName : Text;
    bio : Text;
    profilePictureHash : ?Storage.ExternalBlob;
    headerImageHash : ?Storage.ExternalBlob;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type OldPostType = {
    #original;
    #reply : Nat;
    #repost : Nat;
    #quote : Nat;
  };

  type OldPost = {
    id : Nat;
    author : Principal;
    text : Text;
    mediaHash : ?Storage.ExternalBlob;
    mediaType : ?Text;
    postType : OldPostType;
    createdAt : Time.Time;
    editedAt : ?Time.Time;
  };

  type OldNotificationType = {
    #like : Nat;
    #reply : Nat;
    #mention : Nat;
    #follow;
    #repost : Nat;
    #quote : Nat;
  };

  type OldNotification = {
    id : Nat;
    notificationType : OldNotificationType;
    actorPrincipal : Principal;
    actorUsername : Text;
    createdAt : Time.Time;
    isRead : Bool;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    usernameToUser : Map.Map<Text, Principal>;
    posts : Map.Map<Nat, OldPost>;
    userPostCounts : Map.Map<Principal, Nat>;
    var nextPostId : Nat;
    following : Map.Map<Principal, Map.Map<Principal, Bool>>;
    followers : Map.Map<Principal, Map.Map<Principal, Bool>>;
    blocks : Map.Map<Principal, Map.Map<Principal, Bool>>;
    mutes : Map.Map<Principal, Map.Map<Principal, Bool>>;
    postLikes : Map.Map<Nat, Map.Map<Principal, Bool>>;
    postReplies : Map.Map<Nat, Map.Map<Nat, Bool>>;
    postReposts : Map.Map<Nat, Map.Map<Principal, Bool>>;
    repostIndex : Map.Map<Principal, Map.Map<Nat, Nat>>;
    hashtagIndex : Map.Map<Text, Map.Map<Nat, Bool>>;
    userNotifications : Map.Map<Principal, Map.Map<Nat, OldNotification>>;
    var nextNotificationId : Nat;
  };

  // ---- New types (priest-services, inlined) ----
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

  type Service = {
    id : Nat;
    category : ServiceCategory;
    name : BilingualText;
    description : BilingualText;
    displayOrder : Nat;
  };

  type Package = {
    id : Nat;
    name : BilingualText;
    priceMinRupees : Nat;
    priceMaxRupees : Nat;
    includedItems : [BilingualText];
    description : BilingualText;
    displayOrder : Nat;
  };

  type Booking = {
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

  type GalleryItem = {
    id : Nat;
    image : Storage.ExternalBlob;
    title : BilingualText;
    category : Text;
    createdAt : Nat;
  };

  type Review = {
    id : Nat;
    reviewerName : Text;
    rating : Nat;
    testimonial : BilingualText;
    createdAt : Nat;
  };

  type BlogPost = {
    id : Nat;
    title : BilingualText;
    excerpt : BilingualText;
    content : BilingualText;
    image : ?Storage.ExternalBlob;
    slug : Text;
    published : Bool;
    createdAt : Nat;
  };

  type FAQ = {
    id : Nat;
    question : BilingualText;
    answer : BilingualText;
    category : Text;
    displayOrder : Nat;
  };

  type ContactSubmission = {
    id : Nat;
    name : Text;
    phone : Text;
    message : Text;
    createdAt : Nat;
  };

  type ServiceArea = {
    id : Nat;
    name : Text;
  };

  type SocialLink = {
    name : Text;
    url : Text;
  };

  type SiteConfig = {
    panditName : BilingualText;
    tagline : BilingualText;
    contactPhone : Text;
    socialLinks : [SocialLink];
    sankalp : BilingualText;
  };

  type IdCounters = {
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

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    services : List.List<Service>;
    packages : List.List<Package>;
    bookings : List.List<Booking>;
    gallery : List.List<GalleryItem>;
    reviews : List.List<Review>;
    blogPosts : List.List<BlogPost>;
    faqs : List.List<FAQ>;
    contactSubmissions : List.List<ContactSubmission>;
    serviceAreas : List.List<ServiceArea>;
    siteConfig : ?SiteConfig;
    idCounters : IdCounters;
  };

  public func migration(_old : OldActor) : NewActor {
    let services = List.empty<Service>();
    let packages = List.empty<Package>();
    let bookings = List.empty<Booking>();
    let gallery = List.empty<GalleryItem>();
    let reviews = List.empty<Review>();
    let blogPosts = List.empty<BlogPost>();
    let faqs = List.empty<FAQ>();
    let contactSubmissions = List.empty<ContactSubmission>();
    let serviceAreas = List.empty<ServiceArea>();

    // ---- Seed: service categories + services ----
    // Vedic Puja & Havan
    services.add({
      id = 1;
      category = #vedicPujaHavan;
      name = { hi = "गणेश पूजा"; en = "Ganesh Puja" };
      description = {
        hi = "किसी भी शुभ कार्य के आरंभ में गणेश जी की पूजा, विघ्नहर्ता का आशीर्वाद।";
        en = "Invocation of Lord Ganesha at the start of any auspicious occasion for obstacle-free blessings.";
      };
      displayOrder = 1;
    });
    services.add({
      id = 2;
      category = #vedicPujaHavan;
      name = { hi = "सत्यनारायण कथा एवं पूजा"; en = "Satyanarayan Katha & Puja" };
      description = {
        hi = "भगवान विष्णु की सत्यनारायण रूप में कथा एवं हवन, घर की सुख-समृद्धि हेतु।";
        en = "Story and fire ritual honoring Lord Vishnu as Satyanarayan for household prosperity.";
      };
      displayOrder = 2;
    });
    services.add({
      id = 3;
      category = #vedicPujaHavan;
      name = { hi = "लक्ष्मी पूजा"; en = "Lakshmi Puja" };
      description = {
        hi = "धन-धान्य एवं समृद्धि हेतु माँ लक्ष्मी की पूजा एवं हवन।";
        en = "Worship and fire ritual for Goddess Lakshmi to invite wealth and abundance.";
      };
      displayOrder = 3;
    });
    // Graha Dosh & Shanti
    services.add({
      id = 4;
      category = #grahaDoshShanti;
      name = { hi = "नवग्रह शांति पूजा"; en = "Navagraha Shanti Puja" };
      description = {
        hi = "नव ग्रहों के दोष शांति हेतु विधिवत पूजा एवं हवन।";
        en = "Ritual pacification of the nine planets to neutralize planetary afflictions.";
      };
      displayOrder = 4;
    });
    services.add({
      id = 5;
      category = #grahaDoshShanti;
      name = { hi = "मंगल दोष शांति"; en = "Mangal Dosh Shanti" };
      description = {
        hi = "मंगल दोष के दुष्प्रभाव शांति हेतु विशेष पूजा।";
        en = "Special ritual to calm the adverse effects of Mangal (Mars) dosh.";
      };
      displayOrder = 5;
    });
    services.add({
      id = 6;
      category = #grahaDoshShanti;
      name = { hi = "काल सर्प दोष शांति"; en = "Kaal Sarp Dosh Shanti" };
      description = {
        hi = "काल सर्प योग के दोष निवारण हेतु विधिवत अनुष्ठान।";
        en = "Prescribed ritual to remedy the Kaal Sarp yog affliction.";
      };
      displayOrder = 6;
    });
    // Jeevan Samskar
    services.add({
      id = 7;
      category = #jeevanSamskar;
      name = { hi = "नामकरण संस्कार"; en = "Namkaran Samskar" };
      description = {
        hi = "नवजात शिशु के नामकरण का वैदिक संस्कार।";
        en = "Vedic naming ceremony for a newborn child.";
      };
      displayOrder = 7;
    });
    services.add({
      id = 8;
      category = #jeevanSamskar;
      name = { hi = "विवाह संस्कार"; en = "Vivah Samskar" };
      description = {
        hi = "वैदिक विधि से विवाह संस्कार, सात फेरे एवं हवन सहित।";
        en = "Vedic wedding ceremony including the seven vows and fire ritual.";
      };
      displayOrder = 8;
    });
    services.add({
      id = 9;
      category = #jeevanSamskar;
      name = { hi = "गृह प्रवेश पूजा"; en = "Griha Pravesh Puja" };
      description = {
        hi = "नये घर में प्रवेश से पूर्व वास्तु शांति एवं हवन।";
        en = "Vastu shanti and fire ritual before entering a new home.";
      };
      displayOrder = 9;
    });
    // Jyotish Services
    services.add({
      id = 10;
      category = #jyotishServices;
      name = { hi = "ज्योतिष परामर्श"; en = "Jyotish Consultation" };
      description = {
        hi = "जन्म कुंडली आधारित व्यक्तिगत ज्योतिष परामर्श।";
        en = "Personalized Vedic astrology consultation based on the birth chart.";
      };
      displayOrder = 10;
    });
    services.add({
      id = 11;
      category = #jyotishServices;
      name = { hi = "मुहूर्त चयन"; en = "Muhurat Selection" };
      description = {
        hi = "शुभ कार्य हेतु उपयुक्त मुहूर्त का चयन।";
        en = "Auspicious timing selection for important undertakings.";
      };
      displayOrder = 11;
    });

    // ---- Seed: pricing packages ----
    packages.add({
      id = 1;
      name = { hi = "गणेश पूजा पैकेज"; en = "Ganesh Puja Package" };
      priceMinRupees = 1100;
      priceMaxRupees = 2100;
      includedItems = [
        { hi = "गणेश जी का पूजन सामग्री"; en = "Ganesh puja materials" },
        { hi = "हवन सामग्री"; en = "Havan samagri" },
        { hi = "पंडित जी की डक्षिणा"; en = "Pandit dakshina" },
      ];
      description = {
        hi = "विघ्नहर्ता गणेश जी की संपूर्ण पूजा पैकेज, सामग्री एवं डक्षिणा सहित।";
        en = "Complete Ganesh puja package including materials and dakshina.";
      };
      displayOrder = 1;
    });
    packages.add({
      id = 2;
      name = { hi = "सत्यनारायण कथा पैकेज"; en = "Satyanarayan Katha Package" };
      priceMinRupees = 2100;
      priceMaxRupees = 5100;
      includedItems = [
        { hi = "कथा पुस्तिका"; en = "Katha booklet" },
        { hi = "प्रसाद सामग्री"; en = "Prasad samagri" },
        { hi = "हवन सामग्री"; en = "Havan samagri" },
        { hi = "पंडित जी की डक्षिणा"; en = "Pandit dakshina" },
      ];
      description = {
        hi = "सत्यनारायण भगवान की कथा एवं पूजा का संपूर्ण पैकेज।";
        en = "Complete package for the Satyanarayan katha and puja.";
      };
      displayOrder = 2;
    });
    packages.add({
      id = 3;
      name = { hi = "नवग्रह शांति पैकेज"; en = "Navagraha Shanti Package" };
      priceMinRupees = 3100;
      priceMaxRupees = 7500;
      includedItems = [
        { hi = "नवग्रह पूजन सामग्री"; en = "Navagraha puja materials" },
        { hi = "नौ ग्रहों के लिए दान सामग्री"; en = "Donation items for nine planets" },
        { hi = "हवन सामग्री"; en = "Havan samagri" },
        { hi = "पंडित जी की डक्षिणा"; en = "Pandit dakshina" },
      ];
      description = {
        hi = "नवग्रह दोष शांति हेतु संपूर्ण अनुष्ठान पैकेज।";
        en = "Complete ritual package for Navagraha dosh shanti.";
      };
      displayOrder = 3;
    });
    packages.add({
      id = 4;
      name = { hi = "विवाह संस्कार पैकेज"; en = "Vivah Samskar Package" };
      priceMinRupees = 11000;
      priceMaxRupees = 25000;
      includedItems = [
        { hi = "विवाह विधि सामग्री"; en = "Wedding ritual materials" },
        { hi = "हवन सामग्री"; en = "Havan samagri" },
        { hi = "कन्यादान सामग्री"; en = "Kanyadaan materials" },
        { hi = "दो पंडित जी की डक्षिणा"; en = "Dakshina for two pandits" },
      ];
      description = {
        hi = "वैदिक विवाह संस्कार का संपूर्ण पैकेज, सात फेरे एवं हवन सहित।";
        en = "Complete Vedic wedding package including the seven vows and fire ritual.";
      };
      displayOrder = 4;
    });

    // ---- Seed: FAQs ----
    faqs.add({
      id = 1;
      question = {
        hi = "पूजा के लिए बुकिंग कैसे करें?";
        en = "How do I book a puja?";
      };
      answer = {
        hi = "वेबसाइट पर बुकिंग फॉर्म भरें या 9026828075 पर कॉल/व्हाट्सएप करें।";
        en = "Fill the booking form on the website or call/WhatsApp 9026828075.";
      };
      category = "booking";
      displayOrder = 1;
    });
    faqs.add({
      id = 2;
      question = {
        hi = "पंडित जी किन क्षेत्रों में सेवा देते हैं?";
        en = "Which areas does the pandit serve?";
      };
      answer = {
        hi = "वर्तमान में पुणे के सभी प्रमुख क्षेत्रों में सेवा उपलब्ध है।";
        en = "Currently serving all major areas of Pune.";
      };
      category = "service-areas";
      displayOrder = 2;
    });
    faqs.add({
      id = 3;
      question = {
        hi = "क्या पूजा की सामग्री पंडित जी लाते हैं?";
        en = "Does the pandit bring the puja materials?";
      };
      answer = {
        hi = "हाँ, पैकेज में सामग्री शामिल है; अतिरिक्त सामग्री आवश्यकतानुसार।";
        en = "Yes, materials are included in the package; extras as needed.";
      };
      category = "rituals";
      displayOrder = 3;
    });
    faqs.add({
      id = 4;
      question = {
        hi = "क्या ऑनलाइन पूजा की सुविधा है?";
        en = "Is online puja available?";
      };
      answer = {
        hi = "वर्तमान में केवल घर/स्थल पर आयोजित पूजा उपलब्ध है।";
        en = "Currently only on-site puja at home/venue is available.";
      };
      category = "general";
      displayOrder = 4;
    });

    // ---- Seed: service areas (Pune-focused) ----
    let areaNames = [
      "Kharadi", "Wagholi", "Hadapsar", "Magarpatta", "Hinjewadi",
      "Baner", "Aundh", "Pimpri", "Chinchwad", "Viman Nagar",
      "Kalyani Nagar", "Lohegaon", "All Pune",
    ];
    var areaId = 1;
    for (name in areaNames.vals()) {
      serviceAreas.add({ id = areaId; name });
      areaId += 1;
    };

    // ---- Seed: site config ----
    let siteConfig : ?SiteConfig = ?{
      panditName = {
        hi = "पंडित जी";
        en = "Pandit Ji";
      };
      tagline = {
        hi = "वैदिक परंपरा में आपके घर पर पूजा-अनुष्ठान";
        en = "Vedic pujas and rituals at your home, by tradition";
      };
      contactPhone = "9026828075";
      socialLinks = [
        { name = "WhatsApp"; url = "https://wa.me/919026828075" },
        { name = "Phone"; url = "tel:+919026828075" },
      ];
      sankalp = {
        hi = "ॐ शांति: शांति: शांति:";
        en = "Om Shanti Shanti Shanti";
      };
    };

    // ---- Seed: sample reviews ----
    reviews.add({
      id = 1;
      reviewerName = "Rahul Sharma";
      rating = 5;
      testimonial = {
        hi = "गणेश पूजा बहुत भक्तिभाव से संपन्न हुई। पंडित जी का बहुत आभार।";
        en = "The Ganesh puja was performed with great devotion. Many thanks to Pandit Ji.";
      };
      createdAt = 0;
    });
    reviews.add({
      id = 2;
      reviewerName = "Sneha Patil";
      rating = 5;
      testimonial = {
        hi = "विवाह संस्कार वैदिक विधि से अत्यंत सुंदर ढंग से संपन्न हुआ।";
        en = "The wedding ceremony was conducted beautifully as per Vedic tradition.";
      };
      createdAt = 0;
    });

    // ---- Seed: sample blog post ----
    blogPosts.add({
      id = 1;
      title = {
        hi = "गणेश पूजा का महत्व";
        en = "The Significance of Ganesh Puja";
      };
      excerpt = {
        hi = "जानिए क्यों किसी भी शुभ कार्य के आरंभ में गणेश पूजा आवश्यक है।";
        en = "Learn why Ganesh puja is essential at the start of any auspicious work.";
      };
      content = {
        hi = "गणेश जी विघ्नहर्ता हैं। किसी भी शुभ कार्य के आरंभ में उनकी पूजा विघ्नों के निवारण हेतु की जाती है।";
        en = "Lord Ganesha is the remover of obstacles. His worship at the start of any auspicious work is done to remove obstacles.";
      };
      image = null;
      slug = "significance-of-ganesh-puja";
      published = true;
      createdAt = 0;
    });

    // ---- Seed: sample gallery item (placeholder image reference) ----
    gallery.add({
      id = 1;
      image = "" : Storage.ExternalBlob;
      title = {
        hi = "हवन कुंड";
        en = "Havan Kund";
      };
      category = "vedic-puja";
      createdAt = 0;
    });

    {
      accessControlState = AccessControl.initState();
      services;
      packages;
      bookings;
      gallery;
      reviews;
      blogPosts;
      faqs;
      contactSubmissions;
      serviceAreas;
      siteConfig;
      idCounters = {
        var nextServiceId = 12;
        var nextPackageId = 5;
        var nextBookingId = 1;
        var nextGalleryItemId = 2;
        var nextReviewId = 3;
        var nextBlogPostId = 2;
        var nextFAQId = 5;
        var nextContactSubmissionId = 1;
        var nextServiceAreaId = 14;
      };
    };
  };
};
