/* ============================================================================
   Hub Tweaks — brand logo controls (treatment, lockup, header theme, footer).
   Renders into its own root; applies choices as data-* on .hub-app so the
   CSS in hub-base.css does the visual work. Driven by the Tweaks toolbar.
   ============================================================================ */
const { useTweaks, TweaksPanel, TweakSection, TweakSelect, TweakRadio } = window;

const HUB_TWEAK_DEFAULTS = {
  logo: "color-h",
  header: "light",
  footerLogo: "stacked",
};

function applyHubTweaks(t) {
  const app = document.querySelector(".hub-app");
  if (!app) return false;
  app.dataset.logo = t.logo;
  app.dataset.header = t.header;
  app.dataset.footerLogo = t.footerLogo;
  return true;
}

function HubTweaks() {
  const [t, setTweak] = useTweaks(HUB_TWEAK_DEFAULTS);

  React.useEffect(() => {
    // .hub-app may mount a tick after this root; retry until it exists.
    if (applyHubTweaks(t)) return;
    const id = setInterval(() => {
      if (applyHubTweaks(t)) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [t.logo, t.header, t.footerLogo]);

  const logoOpts = [
    { value: "color-h", label: "Color · horizontal" },
    { value: "inverted-h", label: "Inverted · horizontal" },
    { value: "white-h", label: "White · horizontal" },
    { value: "color-v", label: "Color · vertical" },
    { value: "white-v", label: "White · vertical" },
  ];

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand logo" />
      <TweakSelect
        label="Header logo"
        value={t.logo}
        options={logoOpts}
        onChange={(v) => setTweak("logo", v)}
      />
      <TweakRadio
        label="Header background"
        value={t.header}
        options={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
        onChange={(v) => setTweak("header", v)}
      />
      <TweakSection label="Footer logo" />
      <TweakRadio
        label="Lockup"
        value={t.footerLogo}
        options={[
          { value: "stacked", label: "Stacked" },
          { value: "inverted-h", label: "Horizontal" },
        ]}
        onChange={(v) => setTweak("footerLogo", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweak-root")).render(<HubTweaks />);
