import en from "./en.json";
import tr from "./tr.json";
import ar from "./ar.json";
import de from "./de.json";
import es from "./es.json";
import ru from "./ru.json";
import id from "./id.json";
import fr from "./fr.json";
import hi from "./hi.json";
import ko from "./ko.json";
import fa from "./fa.json";

export type TranslationKey = keyof typeof en;

export type Translations = {
  [K in TranslationKey]: (typeof en)[K];
};

export const translations: Record<string, Translations> = {
  en,
  tr,
  ar,
  de,
  es,
  ru,
  id,
  fr,
  hi,
  ko,
  fa,
};

export default translations;
