# Professionals brand usage notes

Professionals keeps the master brand system and the established Studio workflow. The deliberate differences are the Agents tone of voice, `color.professionals.blue` as the journey accent, and the absence of a standalone product symbol. Exact values live in [tokens.json](./brand-tokens.json); use token names rather than introducing raw values.

## Use case map

Start with the task in the first column. The second column names the approved tokens to use. The third column explains the decision in plain language. Read the detailed section linked in the final column before approval.

| When you need to | Use these tokens | Practical rule | Read next |
| --- | --- | --- | --- |
| Build a light page or card | `color.neutral.white`, `color.surface.sand`, `color.neutral.charcoal` | Use White for the clearest reading area. Use Sand for a calmer supporting area. Keep reading text Charcoal. | [Colour hierarchy](#colour-hierarchy) |
| Add brand emphasis | `color.brand.teal`, `color.professionals.blue`, `color.text.emphasis` | Teal carries the ImmoScout24 brand. Blue marks one Professionals focus. Blue never replaces Teal as the main brand colour. | [Colour hierarchy](#colour-hierarchy) |
| Place a logo on a light surface | `logo.asset.horizontal.standard`, `logo.asset.vertical.standard`, `logo.container.backplate`, `logo.minimum.digitalHeight`, `logo.minimum.printHeight` | Choose the horizontal or vertical master for the available space. Place it directly on the surface at or above the relevant minimum size. | [Logo](#logo) |
| Place a logo on a dark surface | `logo.usage.darkBackground.horizontalAsset`, `logo.usage.darkBackground.verticalAsset`, `logo.usage.darkBackground.scout24Color`, `logo.usage.darkBackground.immoShapeColor` | Use the supplied inverse master. Do not rebuild or recolour the standard logo. | [Logo](#logo) |
| Set the main page heading | `fontFamily.headline`, `fontWeight.h1`, `fontSize.headline`, `lineHeight.displayMin`, `lineHeight.displayMax`, `letterSpacing.headline` | Use one main heading per page. This is the only place for the heaviest type weight. | [Hierarchy and typography](#hierarchy-and-typography) |
| Set section headings and body copy | `fontFamily.body`, `fontWeight.display`, `fontWeight.subline`, `fontWeight.body`, `fontSize.displayMin`, `fontSize.displayMax`, `fontSize.sublineMin`, `fontSize.sublineMax`, `fontSize.body`, `lineHeight.body` | Keep one clear step down from section heading to subline to body. Use regular body copy for reading comfort. | [Hierarchy and typography](#hierarchy-and-typography) |
| Emphasise one word or phrase | `highlighter.asset.*`, `highlighter.color.teal`, `highlighter.color.blue`, `highlighter.color.white`, `highlighter.color.sand` | Select one supplied shape and one approved colour. Keep the artwork unchanged and use it once as the focal gesture. | [Professionals highlighters](#professionals-highlighters) |
| Add a primary or secondary action | `cornerRadius.buttonRounded`, `borderWidth.buttonOutlined`, `safeZone.minimumTouchHeight`, `color.neutral.charcoal`, `color.neutral.white`, `color.brand.teal`, `color.professionals.blue`, `color.surface.sand` | Use one filled primary button. Add one outlined secondary button only when a second choice is necessary. | [Buttons and CTAs](#buttons-and-ctas) |
| Choose a photograph | `imagery.example.*`, `cornerRadius.mediaMin`, `cornerRadius.mediaMax` | Search the supplied Professionals imagery first. Choose an authentic professional situation with usable negative space and require approval for the exact file. | [Image treatment](#image-treatment) |
| Write a Professionals message | `copy.claim.mehr`, `copy.address.b2b`, `copy.audienceTerm.*`, `copy.tone.*`, `copyLimit.sentenceWordsMin`, `copyLimit.sentenceWordsMax` | Write one relevant business benefit in formal German. Keep the voice professional, collaborative, approachable, engaged and supportive. | [Tone of voice](#tone-of-voice) |
| Write or fit asset copy | `copyLimit.headlineWordsMax`, `copyLimit.sublineProofSentencesMax`, `copyLimit.ctaWordsMin`, `copyLimit.ctaWordsMax`, `copyLimit.emailSubjectCharactersMax`, `copyLimit.paidDisplayHeadlineLinesMax`, `copyLimit.nativeImageBakedInCharactersMax`, `TO CONFIRM.assetCharacterLimits` | Use the approved word, sentence, line and channel limits. Do not invent a total character limit where none is approved. | [Copy structure](#copy-structure) |
| Create a Story or Reel | `format.socialStory.width`, `format.socialStory.height`, `safeZone.socialStoryTop`, `safeZone.socialStoryBottom` | Use the approved canvas and keep essential content outside the protected top and bottom areas. | [Layouts and formats](#layouts-and-formats) |
| Create portrait or square social work | `format.socialPortrait.*`, `format.socialSquare.*` | Choose the matching canvas, then adapt hierarchy and crop. Do not simply crop the finished master. | [Layouts and formats](#layouts-and-formats) |
| Create a landing page or email | `format.landingContentWidth`, `format.emailWidth`, `safeZone.minimumTouchHeight` | Keep one promise, supporting proof and one primary action. Repeat the same action at the end of a landing page. | [Layouts and formats](#layouts-and-formats) |
| Choose who the message is for | `audience.primary.*`, `audience.secondary.*`, `audience.decisionMakers`, `audience.buyingMotivations` | Select one audience, one decision maker and one supported motivation before writing or designing. | [Target groups](#target-groups) |
| Prepare a final export | Every token used in the asset plus `TO CONFIRM` | Check the selected values against their sources. Escalate every open item and obtain human approval. | [Human approval check](#human-approval-check) |

## Colour hierarchy

- Keep `color.neutral.white` and `color.surface.sand` dominant as surfaces.
- Use `color.brand.teal` as the main ImmoScout24 brand colour and for navigation, confirmation and positive brand moments.
- Use `color.professionals.blue` as the Professionals accent for one deliberate focus or journey-identification moment.
- Use `color.neutral.charcoal` for text, strong contrast and the default primary action.
- Use only one dominant accent field per layout. The second accent remains supporting.
- Never place `color.brand.teal` on `color.professionals.blue` or the reverse, including gradients, highlighters, buttons and logo details. Separate the accents with a neutral surface.
- Never place `color.neutral.white` text on `color.brand.teal`. Accent fields take `color.neutral.charcoal` text.
- Do not introduce additional hues, tints or borrowed journey colours.

## Hierarchy and typography

- Use `fontFamily.headline` and `fontFamily.body` across every Professionals product surface. Do not introduce another typeface.
- Apply the display, headline, subline, body and caption roles from `fontSize.*` and `fontWeight.*`.
- Reserve `fontWeight.h1` for the single main page heading. Every other heading uses `fontWeight.display` or `fontWeight.subline`; body copy uses `fontWeight.body`.
- Keep the headline as the sole dominant text element and within `copyLimit.headlineWordsMax`.
- Respect `fontSize.minimumAdHeadline`, `fontSize.minimumAdBody` and `fontSize.minimumWebBody`.
- Keep display leading within `lineHeight.displayMin` and `lineHeight.displayMax`; use `lineHeight.body` for body copy.
- Use sentence case. Do not use ALL CAPS or Title Case for headlines.
- Do not use dash punctuation in interface or customer copy. Rewrite the sentence with a full stop, comma or conjunction.
- An approved `highlighter.asset.*` may sit behind or beneath one focal word or phrase. Keep the irregular artwork visible and the text readable; do not substitute a generic rectangle, chip or browser effect.
- Text may sit directly on photography only when a full-edge contrast gradient makes every mark readable; never add a local text panel.

## Tone of voice

- Anchor Professionals communication in `copy.claim.mehr` and its “Mehr …” rhythm. Use the full approved claim as written whenever an umbrella statement is needed.
- Adapt the claim only when the brief supplies a concrete benefit: keep every beat starting with “Mehr” and keep the message directed to `copy.address.b2b`.
- Write in all five approved qualities under `copy.tone.*`: professional, collaborative, approachable, engaged and supportive.
- Address B2B audiences with `copy.address.b2b` throughout the journey, not only at first contact. Use the corresponding formal possessive and dative forms.
- Name the audience with `copy.audienceTerm.immobilienProfis` or `copy.audienceTerm.maklerProfis`. These are the approved gender-neutral forms for this context; do not substitute “Makler:innen”.
- Keep sentences between `copyLimit.sentenceWordsMin` and `copyLimit.sentenceWordsMax`, with one idea per sentence.
- Prefer active voice, strong verbs, precise terms and everyday language.
- Avoid marketing clichés, filler words, unexplained jargon, vague superlatives, complex metaphors, unnecessary repetition and exclamation marks.
- Read customer copy aloud before approval. Rewrite anything that does not sound natural.
- The linked Professionals writing agent is an approved drafting aid. Its internal configuration was not accessible during this source scan, so do not treat unverified agent output as a new rule; check every draft against this file and obtain human approval.

## Target groups

- Prioritise `audience.primary.*`: Real Estate Agencies, Property Developers & New Construction Companies, Property Management Companies, and Mortgage & Financing Providers.
- Use `audience.secondary.*` when the brief explicitly addresses Institutional Real Estate Companies or Real Estate Service Providers.
- Write to one segment and one buying role from `audience.decisionMakers` at a time. Do not combine all target groups in one asset.
- For agencies, lead with seller/buyer leads, premium property marketing, visibility, digital efficiency or growth.
- For developers, lead with early qualified buyer reach, project marketing, sales-cycle leads, visibility or reporting.
- For property managers, lead with tenant acquisition, vacancy reduction, digital rental processes, portfolio marketing or operational efficiency.
- For financing providers, lead with qualified financing leads, customer acquisition, digital lead generation or visibility at the right journey moment.
- For institutional companies, lead with portfolio marketing, tenant acquisition, vacancy management, market intelligence or scalable solutions.
- For service providers, lead with access to real-estate professionals, awareness, lead generation or strategic partnerships.
- Choose one supported motivation from `audience.buyingMotivations`; never promise a quantitative result without campaign evidence.

## Copy structure

- Claim: use `copy.claim.mehr`, or a supported adaptation that preserves the repeated “Mehr …” construction and formal address.
- Headline: one business benefit, no more than `copyLimit.headlineWordsMax`. Useful structures are “Mehr {Nutzen} für Sie”, “{Ziel} schneller erreichen” and “Mehr {Nutzen}”. The exact value of `copy.claim.mehr` is the approved exception to the general limit.
- Subline: one sentence of proof for the headline, capped by `copyLimit.sublineProofSentencesMax`; do not introduce a second benefit or a separate promise.
- CTA: a verb phrase between `copyLimit.ctaWordsMin` and `copyLimit.ctaWordsMax`; formal, sentence case and without terminal punctuation. Suitable structural examples are “Beratung anfragen”, “Lösungen entdecken”, “Kontakt aufnehmen” and “Mehr erfahren”.
- Email subject: benefit first and no more than `copyLimit.emailSubjectCharactersMax`.
- Paid display: keep the headline within `copyLimit.paidDisplayHeadlineLinesMax` and keep the logo visible.
- Native image: use `copyLimit.nativeImageBakedInCharactersMax`. The platform headline field carries the message.
- Exact total character limits for headlines, sublines, CTAs and paid display remain `TO CONFIRM.assetCharacterLimits`. Do not convert a responsive fit estimate into a brand token.
- Measure the real copy in every selected format. Keep the headline and logo first. When a smaller canvas needs less content, remove the subline before the CTA. Never solve overflow by reducing type or logo below the approved minimum.
- Use the approved vocabulary: `copy.audienceTerm.*`, listings, properties, visibility, professional presence, qualified contacts, leads, connected tools, efficient marketing, transactions and added value.
- Reuse verified product facts exactly as supplied by the product owner or approved live source. Keep package and tier limitations next to the related claim. Copy mandatory legal and offer wording verbatim.
- The Professionals feature vocabulary, proof points, package cautions and fixed legal or offer lines remain `TO CONFIRM`. Until supplied, describe the audience outcome and do not present it as a proven product feature.
- German numeric conventions use a point for thousands, a comma for decimals and a space before the unit or currency symbol. Use formal `Sie`, `Ihr` and `Ihre` throughout.
- Treat campaign performance, legal and product feature claims as `TO CONFIRM` unless the brief supplies an approved source.

## Logo

- Use only the six supplied files under `logo.asset.horizontal` and `logo.asset.vertical`.
- Prefer `logo.asset.vertical.standard` for the Professionals Studio landing page, the guideline cover and compact or portrait brand signatures. Use `logo.asset.horizontal.standard` only when a clearly horizontal space makes the stacked master impractical.
- Use the standard master on light or accent surfaces. On every dark background, use `logo.usage.darkBackground.horizontalAsset` or `logo.usage.darkBackground.verticalAsset`: the Immo shape remains `color.brand.teal` and “Scout24” uses `logo.usage.darkBackground.scout24Color`. Never place the standard dark-lettered master on a dark surface.
- The supplied white variant is not an all-white logo: it has a White Immo shape and Charcoal “Scout24”. Use it only on `color.professionals.blue`. Never place it on `color.neutral.white` or `color.brand.teal`, and never use it instead of the inverse master on a dark background.
- Keep logo height at or above `logo.minimum.digitalHeight` in digital work and `logo.minimum.printHeight` in print.
- Apply `logo.container.backplate`: the value is `none`. The logo sits directly on the composition and never inside a box, card, pill, plate or holding shape.
- Do not redraw, typeset, recolour, stretch, crop, rotate or add effects to the logo.
- Do not add a product symbol, cross, badge or newly typeset Professionals lockup.
- Logo clear-space measurement and fixed placements outside `logo.placement.a4_3` remain `TO CONFIRM`.

## Professionals highlighters

- Use only the ten supplied shapes under `highlighter.asset.*`. Keep each SVG unchanged as the artwork master.
- Recolour a highlighter only with `highlighter.color.teal`, `highlighter.color.blue`, `highlighter.color.white` or `highlighter.color.sand`.
- Use one highlighter as the focal gesture in a composition: underline a word, point to an object or CTA, show upward movement, or confirm one action.
- Keep the original silhouette and aspect ratio. Crop only when the approved composition clearly continues the gesture beyond the edge.
- Use White or Sand highlighters only on a dark or photographic surface with sufficient contrast.
- Highlighters support the message. They never replace the logo, CTA, product proof or Professionals identity.
- Do not repeat them as a pattern, build decorative confetti, invent new shapes, add effects or use an unapproved colour.

## Buttons and CTAs

- Use ButtonRounded with `cornerRadius.buttonRounded`.
- Use filled for the primary action and outlined with `borderWidth.buttonOutlined` for the secondary action.
- The Blue outlined secondary uses `color.professionals.blue` for the border, `color.neutral.white` for the fill and `color.neutral.charcoal` for the label. It never replaces the filled primary action.
- `color.neutral.charcoal` is the default filled button with a `color.neutral.white` label. Teal, Blue, White and Sand fills take a Charcoal label.
- White and Sand fills need a hairline boundary on a light surface.
- Use one filled button per view. An outlined button appears only as the second choice beside a filled button.
- Medium is the default size. Large is for landing-page heroes and final CTA blocks. Small is desktop-only and must not fall below `safeZone.minimumTouchHeight`.
- No weak fills, text buttons, elevated buttons, danger or success variants. No gradients, shadows or icons in the label.

## Image treatment

- Search the supplied Professionals imagery first. Use a relevant file from `imagery.example.*` before requesting a new image, generating an image or leaving a placeholder.
- The current supplied package is reference imagery, not a blanket production-approved library. Keep the selected file visible and traceable, then require human approval; the user will add the final approved asset set later.
- Make the subject professional yet approachable: competent and authentic, never overly polished, posed or staged.
- Prefer genuine interactions and expressions. Show agents with clients, conducting property tours or working with relevant tools.
- Use recognisable German offices, apartments and houses. Keep work props such as laptops, notebooks and coffee cups subtle; they support the scene and never dominate it.
- Keep lighting slightly warm, soft and diffused. In real offices, balance ambient light with soft adjustable light. Avoid harsh light.
- Maintain subtle contrast between subject and background. Keep backgrounds clean, lightly textured or softly blurred.
- Eye level is the default perspective for authenticity. Mix wide shots for workplace context with close portraits for individual professionals. A slightly higher viewpoint may convey approachability and authority; a lower viewpoint may suggest strength and leadership.
- Preserve negative space at the sides for approved copy, logo and graphic elements. Crop for the required format without removing the professional context.
- Use `cornerRadius.mediaMin` to `cornerRadius.mediaMax` for photo blocks and inset media.
- Make only light adjustments to exposure, contrast and colour balance. Use cohesive, subtle grading; never use heavy filters, oversaturation or unnatural effects.
- Organise source material under the Figma categories Work, Portrait, Props, Listing, Additional Business, Moments and Compositions.
- The previews recorded in `imagery.example.*` come from the supplied package and meet the written B2B criteria; they do not prove that every file in that package is approved.
- Licensed stock must cover paid advertising in the campaign territory; retain the licence reference. Final asset selection and licensing remain `TO CONFIRM`.
- AI imagery is allowed only when it looks natural, contains no text or third-party brand, keeps its prompt, follows platform disclosure rules and receives human review.

## Build an asset in four decisions

1. Choose one audience under `audience.primary.*` or `audience.secondary.*`, one role from `audience.decisionMakers` and one real need from `audience.buyingMotivations`.
2. Choose one supported benefit and one verified proof point. Apply `copyLimit.*` and keep any unconfirmed claim behind human approval.
3. Choose one editable layout family and one approved image under `imagery.example.*`. A different design choice must change the composition, not only the colour.
4. Choose the channel and approved `format.*`. Let the Studio adapt crop and hierarchy, then check source, claim, logo, fit and protected areas before approval.

## Layouts and formats

- Assemble every asset from a clear field, one headline, one CTA, one approved logo and optionally one photograph or one approved `highlighter.asset.*`.
- Treat the files in `Assets/reference/general-approved-2026-09-04` as evidence for composition only. Change Design includes full frame portraits, straight and angled splits, image first and copy first posters, contained photo galleries and typographic statements. Each rebuilds a supplied composition principle with approved tokens.
- Transfer the composition principle only. Never show or place a flattened reference file as an editable Professionals design.
- In Change Design, every option must expose editable copy, image, crop, logo and colour fields. Choosing another option must change the layout geometry and reading path, not only the palette.
- Replace any purple or yellow graphic treatment visible in a general reference with a suitable token from `color.brand.teal`, `color.professionals.blue`, `color.neutral.charcoal`, `color.neutral.white` or `color.surface.sand`.
- Rewrite all reference copy for the selected Professionals audience and business need. Never carry Plus terminology, Plus symbols, informal `Du/Dir/Deine` language or consumer-journey messaging into the asset.
- Keep every customer-facing line in sentence case even when the reference uses vertical or oversized all-caps typography. Layout direction may transfer; capitalisation may not.
- Landing pages use `format.landingContentWidth`, with copy left, visual right, one accent surface and the same CTA repeated at the end.
- Email uses `format.emailWidth`, a Sand body, a White card, solid colours and one primary CTA.
- Paid social uses `format.socialStory`, `format.socialPortrait` and `format.socialSquare`.
- Keep the top `safeZone.socialStoryTop` and bottom `safeZone.socialStoryBottom` of Story/Reel assets free of essential content.
- Display headlines stay within two lines; the logo remains visible. The smallest display format is logo-only.
- Native placements receive a photo-led image without baked-in copy; the platform headline field carries the message.
- Compact banners follow logo → one-line benefit → CTA and respect `safeZone.minimumTouchHeight`.

## Source quality and safe placement

- Compose from the original photograph, not a reduced planning preview. The thumbnail is a smaller view of the final export composition.
- When a photograph would need excessive enlargement or a destructive crop, keep the whole photograph inside a smaller photo region and use a neutral field around it. A gallery or split composition is often the better choice. Do not stretch the photograph.
- Treat enlargement and retained image area as engineering measurements, not proof that faces, hands or product details are safe. A person must check the subject and the final crop.
- Apply the placement catalogue and the relevant `safeZone.*` tokens to every essential text mark, logo, button and highlighter. Checking only the headline box is not sufficient.
- Hold an export when essential content cannot fit, the required logo is missing, no content is drawn or the encoded file exceeds the placement limit. Explain the next action instead of shipping a known invalid file.
- Inspect any reported copy omission before approval. Smaller placements can omit supporting copy; they must not silently lose mandatory claims or legal text.

## Prohibited choices

- No standalone product symbol, cross, badge, decorative circle, blob or floating shape.
- No purple or yellow graphic colour in Professionals assets, including colours copied from an approved general reference.
- No all-caps customer-facing headline, subline, CTA, label or proof point.
- No altered, repeated or newly drawn highlighter and no highlighter colour outside `highlighter.color.*`.
- No Professionals Blue replacing Teal as the master brand colour.
- No logo backplate or reconstructed logo.
- No unapproved colour, typeface, button variant, image treatment or layout family.
- No unsubstantiated performance, product or legal claim.

## Human approval check

Before export, verify the approved logo file and direct placement, colour hierarchy, highlighter asset and colour, typography role and minimums, Agents tone of voice, copy limits, imagery source and treatment, format dimensions, safe zones, CTA hierarchy, legal requirements and claim evidence. Escalate any item still marked `TO CONFIRM`.

## How the files work together

- Start with this file when you need to make a brand decision. The [use case map](#use-case-map) points from a familiar task to the correct token names and detailed rule.
- Treat `brand/tokens.json` as the single approved source for exact reusable values. Do not maintain a second hand edited token list.
- Publish the approved source as `src/brand-tokens.json` for tools and `src/brand-tokens.css` for websites by running `node scripts/sync-brand-tokens.mjs`.
- Publish this guide as `src/brand-notes.md` and the evidence inventory as `src/brandsources.md` with the same command so people can download all four files from the Brand Guidelines.
- Share token names with designers, developers, agencies and automated tools. They can retrieve the exact value from the JSON or CSS file without interpreting a screenshot.
- Keep the detailed token values out of the guideline reading flow. The page teaches the system. The downloads carry production data.
- Validate that every exact token has a `source` field before publishing. Values marked `TO CONFIRM` stay behind human approval.
