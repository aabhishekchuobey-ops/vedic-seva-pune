module {
  // Cross-cutting types shared across the priest-services domain.

  // Unix-style timestamp in nanoseconds (matches mo:core/Time).
  public type Timestamp = Nat;

  // Bilingual content: Hindi (Devanagari) + English, defaulting to Hindi.
  public type BilingualText = {
    hi : Text;
    en : Text;
  };

  // Service categories offered by the pandit.
  public type ServiceCategory = {
    #vedicPujaHavan;
    #grahaDoshShanti;
    #jeevanSamskar;
    #jyotishServices;
  };

  // Language preference for a booking or service delivery.
  public type LanguagePreference = {
    #hindi;
    #english;
    #bilingual;
  };
};
