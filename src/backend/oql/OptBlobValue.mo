// OQL _toRow instance for ?Blob (Storage.ExternalBlob option). Options have no
// built-in _toRow; null and a present blob must collapse to the SAME Value
// variant so the schema type does not flip-flop. Sentinel "" represents null.
// A present ExternalBlob is UTF-8 text ("!caf!sha256:..."), decoded for
// readability; non-UTF-8 binary falls back to a size placeholder. Imported
// top-level in main.mo so the auto-derive resolver finds it.
import Text  "mo:core/Text";
import Nat   "mo:core/Nat";
import Types "mo:caffeineai-oql/Types";

module {
  type Value = Types.Value;

  public func _toRow(self : ?Blob) : Value = switch self {
    case null #text("");
    case (?b) switch (b.decodeUtf8()) {
      case (?t) #text(t);
      case null #text("<blob:" # b.size().toText() # " bytes>");
    };
  };
};
